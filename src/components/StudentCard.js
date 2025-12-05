import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudentCard({ student }) {
	const name = student.Nama || student.nama || student.name || '-';
	const nim = student.NIM || student.nim || student.id || '-';
	const prodi = student.Prodi || student.prodi || student.jurusan || '-';
	const angkatan =
		student.Angkatan || student.angkatan || student.angk || student.year || '-';

	const initial = (name && name[0]) ? name[0].toUpperCase() : '?';
	return (
		<View style={styles.card}>
			<View style={styles.avatar}>
				<Text style={styles.avatarText}>{initial}</Text>
			</View>
			<View style={styles.info}>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.detail}>NIM: {nim}</Text>
				<Text style={styles.detailSmall}>{prodi} • {angkatan}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 12,
		marginHorizontal: 16,
		marginVertical: 8,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: '#007AFF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	avatarText: { color: '#fff', fontWeight: '700', fontSize: 20 },
	info: { flex: 1 },
	name: { fontSize: 16, fontWeight: '700', marginBottom: 4, color: '#111' },
	detail: { color: '#444', marginBottom: 4 },
	detailSmall: { color: '#666', fontSize: 12 },
});
