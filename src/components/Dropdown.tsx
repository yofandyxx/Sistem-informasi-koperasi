/**
 * ============================================================
 * 
 * Konsep penting:
 * 1. Reusable Component dan TypeScript Props
 * 2. React Hooks (useState)
 * 3. Conditional Rendering
 * 4. Modal, ScrollView, dan Pressable
 * 5. Callback onChange dan penanda opsi aktif
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ============================================================
// 2. DEFINISI TIPE DATA PILIHAN DROPDOWN
// ============================================================
// Setiap pilihan wajib memiliki label dan value.
// Description bersifat opsional untuk informasi tambahan.
export type DropOption = {
  label: string;
  value: string;
  description?: string;
};

// ============================================================
// 3. KOMPONEN UTAMA DROPDOWN DAN PROPS
// ============================================================
export default function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder = 'Pilih data',
}: {
  label: string;
  value: string;
  options: DropOption[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  // ==========================================================
  // 4. STATE MODAL DAN PILIHAN AKTIF
  // ==========================================================
  // open menentukan apakah Modal pilihan sedang ditampilkan.
  const [open, setOpen] = useState(false);

  // Cari objek pilihan yang value-nya sama dengan value dari props.
  const selected = options.find(x => x.value === value);

  // ==========================================================
  // 5. TAMPILAN UTAMA DROPDOWN
  // ==========================================================
  return (
    <View>
      {/* 5.1 Label field dropdown */}
      <Text style={s.label}>{label}</Text>

      {/* 5.2 Tombol untuk membuka Modal daftar pilihan */}
      <Pressable style={s.select} onPress={() => setOpen(true)}>
        <View style={{ flex: 1 }}>
          {/* Tampilkan label terpilih atau placeholder. */}
          <Text style={selected ? s.value : s.placeholder}>
            {selected?.label || placeholder}
          </Text>

          {/* Deskripsi hanya tampil jika pilihan memilikinya. */}
          {selected?.description && (
            <Text style={s.desc}>{selected.description}</Text>
          )}
        </View>

        {/* Ikon penanda bahwa field dapat membuka daftar pilihan. */}
        <Ionicons name="chevron-down" size={20} color="#475467" />
      </Pressable>

      {/* ====================================================== */}
      {/* 6. MODAL DAFTAR PILIHAN */}
      {/* ====================================================== */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Menekan area overlay akan menutup Modal. */}
        <Pressable style={s.overlay} onPress={() => setOpen(false)}>
          <View style={s.modal}>
            {/* 6.1 Judul Modal mengikuti label dropdown. */}
            <Text style={s.title}>{label}</Text>

            {/* 6.2 Daftar pilihan dapat digulir jika terlalu panjang. */}
            <ScrollView style={{ maxHeight: 360 }}>
              {options.map(o => (
                <Pressable
                  key={o.value}
                  style={[s.option, o.value === value && s.active]}
                  onPress={() => {
                    // Kirim value pilihan ke komponen induk.
                    onChange(o.value);
                    // Tutup Modal setelah pengguna memilih opsi.
                    setOpen(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    {/* Warna teks berubah untuk opsi yang aktif. */}
                    <Text
                      style={[
                        s.optText,
                        o.value === value && s.activeText,
                      ]}
                    >
                      {o.label}
                    </Text>

                    {/* Deskripsi opsi ditampilkan jika tersedia. */}
                    {o.description && (
                      <Text style={s.desc}>{o.description}</Text>
                    )}
                  </View>

                  {/* 6.3 Ikon centang hanya tampil pada opsi aktif. */}
                  {o.value === value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={21}
                      color="#087f5b"
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// ============================================================
// 7. STYLESHEET - PENGATURAN TAMPILAN DROPDOWN
// ============================================================
const s = StyleSheet.create({
  // Label di atas field dropdown.
  label: {
    fontWeight: '800',
    color: '#344054',
    marginBottom: 6,
  },

  // Kotak pilihan yang dapat ditekan.
  select: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Teks nilai yang sudah dipilih.
  value: {
    fontWeight: '700',
    color: '#1d2939',
  },

  // Teks petunjuk ketika belum ada pilihan.
  placeholder: {
    color: '#98a2b3',
  },

  // Deskripsi tambahan di bawah label pilihan.
  desc: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },

  // Latar transparan gelap di belakang Modal.
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,.45)',
    justifyContent: 'center',
    padding: 22,
  },

  // Kartu putih berisi daftar pilihan.
  modal: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
  },

  // Judul pada bagian atas Modal.
  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
    color: '#101828',
  },

  // Baris untuk setiap pilihan dropdown.
  option: {
    padding: 13,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  // Latar hijau muda pada pilihan aktif.
  active: {
    backgroundColor: '#ecfdf3',
  },

  // Teks pilihan biasa.
  optText: {
    fontWeight: '700',
    color: '#344054',
  },

  // Teks hijau pada pilihan aktif.
  activeText: {
    color: '#087f5b',
  },
});
