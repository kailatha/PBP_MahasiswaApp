import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	Alert,
	RefreshControl,
	TouchableOpacity,
	Modal,
	TextInput,
	Pressable,
	KeyboardAvoidingView,
	Platform
} from 'react-native';
import StudentCard from '../components/StudentCard';
import { fetchStudents, signOut, addStudent } from '../services/AuthService';
import { auth } from '../config/firebaseConfig';

export default function StudentsScreen({ navigation }) {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		let mounted = true;
		// Wait for auth state to be known before fetching students
		const unsubscribe = auth().onAuthStateChanged(async (u) => {
			if (!mounted) return;
			if (u) {
				if (__DEV__) console.log('Auth ready, uid=', u.uid);
				try {
					const data = await fetchStudents();
					if (mounted) setStudents(data);
				} catch (e) {
					const code = e && e.code ? e.code : 'unknown';
					Alert.alert('Error', `${code}: ${e.message || 'Gagal mengambil data mahasiswa'}`);
					if (__DEV__) console.error('fetchStudents error', e);
				} finally {
					if (mounted) setLoading(false);
				}
			} else {
				// No user: navigate back to Login
				if (mounted) {
					setStudents([]);
					setLoading(false);
					navigation.replace('Login');
				}
			}
		});
		return () => {
			mounted = false;
			unsubscribe();
		};
	}, []);

	const onSignOut = async () => {
		try {
			await signOut();
			navigation.replace('Login');
		} catch (e) {
			Alert.alert('Error', e.message || 'Gagal keluar');
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const data = await fetchStudents();
			setStudents(data);
		} catch (e) {
			if (__DEV__) console.error('refresh error', e);
			Alert.alert('Error', e.message || 'Gagal menyegarkan data');
		} finally {
			setRefreshing(false);
		}
	};

	// Add student modal state
	const [showAdd, setShowAdd] = useState(false);
	const [newNama, setNewNama] = useState('');
	const [newNIM, setNewNIM] = useState('');
	const [newProdi, setNewProdi] = useState('');
	const [newAngkatan, setNewAngkatan] = useState('');
	const [adding, setAdding] = useState(false);

	const onAddStudent = async () => {
		if (!newNama || !newNIM) {
			Alert.alert('Validasi', 'Nama dan NIM harus diisi');
			return;
		}
		setAdding(true);
		try {
			await addStudent({ Nama: newNama, NIM: newNIM, Prodi: newProdi, Angkatan: newAngkatan });
			// refresh list
			const data = await fetchStudents();
			setStudents(data);
			setShowAdd(false);
			setNewNama('');
			setNewNIM('');
			setNewProdi('');
			setNewAngkatan('');
			Alert.alert('Sukses', 'Mahasiswa berhasil ditambahkan');
		} catch (e) {
			if (__DEV__) console.error('addStudent error', e);
			Alert.alert('Error', e.message || 'Gagal menambahkan mahasiswa');
		} finally {
			setAdding(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color="#007AFF" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Daftar Mahasiswa</Text>
				<TouchableOpacity style={styles.headerButton} onPress={onSignOut}>
					<Text style={styles.headerButtonText}>Keluar</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={students}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <StudentCard student={item} />}
				contentContainerStyle={{ paddingBottom: 20 }}
				ListEmptyComponent={<Text style={styles.empty}>Tidak ada data mahasiswa.</Text>}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007AFF"]} />}
			/>

			{/* Add student modal */}
			<Modal visible={showAdd} animationType="slide" transparent>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Tambah Mahasiswa</Text>
						<TextInput placeholder="Nama" placeholderTextColor="#9AA0A6" style={styles.modalInput} value={newNama} onChangeText={setNewNama} />
						<TextInput placeholder="NIM" placeholderTextColor="#9AA0A6" style={styles.modalInput} value={newNIM} onChangeText={setNewNIM} />
						<TextInput placeholder="Prodi" placeholderTextColor="#9AA0A6" style={styles.modalInput} value={newProdi} onChangeText={setNewProdi} />
						<TextInput placeholder="Angkatan" placeholderTextColor="#9AA0A6" style={styles.modalInput} value={newAngkatan} onChangeText={setNewAngkatan} />
						<View style={styles.modalActions}>
							<Pressable style={[styles.modalButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e6e6' }]} onPress={() => setShowAdd(false)}>
								<Text style={{ color: '#333' }}>Batal</Text>
							</Pressable>
							<Pressable style={[styles.modalButton, { backgroundColor: '#007AFF' }]} onPress={onAddStudent} disabled={adding}>
								<Text style={{ color: '#fff' }}>{adding ? 'Menyimpan...' : 'Simpan'}</Text>
							</Pressable>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			{/* Floating Add button */}
			<TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
				<Text style={styles.fabText}>+</Text>
			</TouchableOpacity>
		</View>
	);
}

	const styles = StyleSheet.create({
	    container: { flex: 1, backgroundColor: '#F6F7FB' },
	    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	    title: { fontSize: 20, fontWeight: '700' },
	    header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	    headerButton: { backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
	    headerButtonText: { color: '#007AFF', fontWeight: '600' },
	    empty: { padding: 16, textAlign: 'center', color: '#666' },

	    /* FAB */
	    fab: {
	        position: 'absolute',
	        right: 20,
	        bottom: 26,
	        width: 56,
	        height: 56,
	        borderRadius: 28,
	        backgroundColor: '#007AFF',
	        justifyContent: 'center',
	        alignItems: 'center',
	        shadowColor: '#000',
	        shadowOpacity: 0.18,
	        shadowRadius: 6,
	        shadowOffset: { width: 0, height: 4 },
	        elevation: 6,
	    },
	    fabText: { color: '#fff', fontSize: 28, lineHeight: 28 },

	    /* Modal */
	    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
	    modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 8 },
	    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
	    modalInput: { borderWidth: 1, borderColor: '#E6E9F0', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10, color: '#111' },
	    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
	    modalButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginLeft: 8 },
	});
