/**
 * ============================================================
 
 * ============================================================
 */

import React, { useEffect, useState } from 'react';
import {
  Alert, Pressable, RefreshControl, ScrollView,
  StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { api } from './src/api/api';
import { Loading } from './src/components/UI';
import {
  DashboardScreen, InstallmentScreen, LoansScreen,
  LoginScreen, MemberFormScreen, MembersScreen,
  ReportScreen, SavingsScreen, TransactionHistoryScreen,
  UserManagementScreen,
} from './src/screens';
import {
  Loan, Member, ScreenName, Summary, Transaction, User,
} from './src/types';

// Data awal sebelum ringkasan diterima dari Google Sheets.
const EMPTY: Summary = {
  total_members: 0,
  active_members: 0,
  total_savings: 0,
  total_loan_principal: 0,
  total_loan_remaining: 0,
  total_installments: 0,
  active_loans: 0,
};

// Judul yang ditampilkan pada header sesuai screen aktif.
const TITLES: Record<ScreenName, string> = {
  dashboard: 'Dashboard',
  members: 'Data Anggota',
  memberForm: 'Form Anggota',
  savings: 'Transaksi Simpanan',
  loans: 'Pinjaman',
  installment: 'Bayar Angsuran',
  history: 'Riwayat',
  reports: 'Laporan',
  users: 'User Management',
};

function AppBody() {
  // State login, navigasi, dan data yang digunakan bersama.
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<ScreenName>('dashboard');
  const [summary, setSummary] = useState<Summary>(EMPTY);
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /** Mengambil data dari Apps Script REST API secara paralel. */
  const load = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const [summaryResponse, memberResponse, loanResponse, transactionResponse] =
        await Promise.all([
          api.summary(),
          api.members(),
          api.loans(),
          api.transactions(),
        ]);

      setSummary(summaryResponse.data);
      setMembers(memberResponse.data);
      setLoans(loanResponse.data);
      setTransactions(transactionResponse.data);

      // Daftar user hanya dimuat untuk ADMIN.
      if (user?.role === 'ADMIN') {
        try {
          const userResponse = await api.users();
          setUsers(userResponse.data);
        } catch {
          // Kegagalan memuat user tidak menghentikan data utama.
        }
      }
    } catch (e: any) {
      Alert.alert('Koneksi API', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Memuat data saat user berhasil login.
  useEffect(() => {
    if (user) load();
  }, [user]);

  // Belum login: tampilkan halaman autentikasi.
  if (!user) {
    return (
      <SafeAreaView style={s.loginSafe}>
        <LoginScreen onLogin={(loginUser) => {
          setUser(loginUser);
          setScreen('dashboard');
        }} />
      </SafeAreaView>
    );
  }

  /** Navigasi dengan pembatasan hak akses berdasarkan role. */
  const navigate = (to: ScreenName) => {
    if (
      user.role === 'PIMPINAN' &&
      !['dashboard', 'history', 'reports'].includes(to)
    ) {
      return Alert.alert(
        'Hak Akses',
        'Role PIMPINAN hanya dapat melihat dashboard, riwayat dan laporan.'
      );
    }

    if (
      user.role === 'PETUGAS' &&
      ['memberForm', 'users'].includes(to)
    ) {
      return Alert.alert('Hak Akses', 'Fitur ini hanya untuk ADMIN.');
    }

    // Form anggota baru tidak membawa data edit sebelumnya.
    if (to === 'memberForm') setEditing(null);
    setScreen(to);
  };

  /** Memilih halaman yang ditampilkan berdasarkan screen aktif. */
  const content = () => {
    if (screen === 'dashboard') {
      return (
        <DashboardScreen
          summary={summary}
          navigate={navigate}
          user={user}
          transactions={transactions}
        />
      );
    }

    if (screen === 'members') {
      return (
        <MembersScreen
          members={members}
          navigate={navigate}
          role={user.role}
          reload={() => load(true)}
          onEdit={(member) => {
            setEditing(member);
            setScreen('memberForm');
          }}
        />
      );
    }

    if (screen === 'memberForm') {
      return (
        <MemberFormScreen
          editing={editing}
          onDone={() => setEditing(null)}
          reload={() => load(true)}
          navigate={navigate}
        />
      );
    }

    if (screen === 'savings') {
      return (
        <SavingsScreen
          members={members}
          reload={() => load(true)}
          navigate={navigate}
        />
      );
    }

    if (screen === 'loans') {
      return (
        <LoansScreen
          members={members}
          loans={loans}
          reload={() => load(true)}
        />
      );
    }

    if (screen === 'installment') {
      return (
        <InstallmentScreen
          members={members}
          loans={loans}
          reload={() => load(true)}
          navigate={navigate}
        />
      );
    }

    if (screen === 'history') {
      return (
        <TransactionHistoryScreen
          transactions={transactions}
          members={members}
        />
      );
    }

    if (screen === 'users') {
      return <UserManagementScreen users={users} />;
    }

    // Screen laporan menjadi fallback seperti kode asli.
    return <ReportScreen summary={summary} />;
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />

      {/* Header dan tombol aksi */}
      <View style={s.header}>
        <View style={s.brandRow}>
          <View style={s.logo}>
            <Ionicons name="business" size={22} color="#fff" />
          </View>
          <View>
            <Text style={s.brand}>PPNP KOPERASI</Text>
            <Text style={s.title}>{TITLES[screen]}</Text>
          </View>
        </View>

        <View style={s.headerActions}>
          {user.role === 'ADMIN' && (
            <Pressable onPress={() => {
              setScreen('users');
              load(true);
            }}>
              <Ionicons name="people-circle" size={27} color="#d1fae5" />
            </Pressable>
          )}

          <Pressable onPress={() => Alert.alert(
            'Keluar',
            `Keluar dari akun ${user.full_name}?`,
            [
              { text: 'Batal' },
              {
                text: 'Keluar',
                onPress: () => {
                  setUser(null);
                  setScreen('dashboard');
                },
              },
            ]
          )}>
            <Ionicons name="log-out-outline" size={26} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Konten halaman dan pull-to-refresh */}
      <ScrollView
        style={s.body}
        contentContainerStyle={s.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load(true);
            }}
          />
        }
      >
        {loading ? <Loading /> : content()}
      </ScrollView>

      {/* Menu navigasi bawah */}
      <BottomTabs screen={screen} navigate={navigate} />
    </SafeAreaView>
  );
}

/** Bottom navigation dengan penanda menu aktif. */
function BottomTabs({ screen, navigate }: {
  screen: ScreenName;
  navigate: (screen: ScreenName) => void;
}) {
  const tabs: [ScreenName, any, string][] = [
    ['dashboard', 'home', 'Beranda'],
    ['members', 'people', 'Anggota'],
    ['history', 'receipt', 'Riwayat'],
    ['reports', 'bar-chart', 'Laporan'],
  ];

  return (
    <View style={s.tabs}>
      {tabs.map(([name, icon, label]) => {
        const isActive = screen === name;
        return (
          <Pressable
            key={name}
            style={s.tab}
            onPress={() => navigate(name)}
          >
            <View style={[
              s.tabIconBox,
              isActive && s.tabIconBoxActive,
            ]}>
              <Ionicons
                name={icon}
                size={21}
                color={isActive ? '#087F5B' : '#667085'}
              />
            </View>
            <Text style={[s.tabText, isActive && s.active]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Desain asli dipertahankan: header hijau tua dan tab hijau muda.
const s = StyleSheet.create({
  loginSafe: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  safe: {
    flex: 1,
    backgroundColor: '#064e3b',
  },
  header: {
    paddingHorizontal: 17,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#064e3b',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#0ca678',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: '#a7f3d0',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '900',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  tabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    flexDirection: 'row',
    backgroundColor: '#E7F6EF',
    borderTopWidth: 1,
    borderTopColor: '#A7DCC7',
    elevation: 10,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIconBox: {
    minWidth: 42,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconBoxActive: {
    backgroundColor: '#C7EBDD',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#667085',
  },
  active: {
    color: '#087F5B',
    fontWeight: '900',
  },
});

/** Root aplikasi menyediakan SafeArea untuk seluruh halaman. */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppBody />
    </SafeAreaProvider>
  );
}
