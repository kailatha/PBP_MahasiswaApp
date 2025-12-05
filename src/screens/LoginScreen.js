import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	ActivityIndicator,
	Alert,
	TouchableOpacity,
	Pressable
} from 'react-native';
import { login, register } from '../services/AuthService';

export default function LoginScreen({ navigation }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [isRegister, setIsRegister] = useState(false);
	const [error, setError] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const onSubmit = async () => {
		setError('');
		if (!email || !password) {
			setError('Email dan password harus diisi');
			return;
		}
		setLoading(true);
		try {
			if (isRegister) {
				// validate password length and confirmation
				if (password.length < 6) {
					setError('Password minimal 6 karakter');
					return;
				}
				if (password !== confirmPassword) {
					setError('Password dan konfirmasi tidak cocok');
					return;
				}
				await register(email.trim(), password);
				Alert.alert('Sukses', 'Akun berhasil dibuat. Silakan login.');
				setIsRegister(false);
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				return;
			}
			await login(email.trim(), password);
			navigation.replace('Mahasiswa');
		} catch (e) {
			const msg = e && e.message ? e.message : 'Terjadi kesalahan';
			setError(msg);
			if (__DEV__) console.error('auth error', e);
		} finally {
			setLoading(false);
		}
	};

  

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.logo}>
					<Text style={styles.logoText}>UN</Text>
				</View>
				<Text style={styles.title}>{isRegister ? 'Daftar' : 'Masuk'}</Text>
				<Text style={styles.subtitle}>Silakan masuk menggunakan email kampus Anda</Text>

				<TextInput
					placeholder="Email"
					placeholderTextColor="#9AA0A6"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					style={styles.input}
				/>
				<TextInput
					placeholder="Password"
					placeholderTextColor="#9AA0A6"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					style={styles.input}
				/>
					{isRegister && (
						<TextInput
							placeholder="Konfirmasi Password"
							placeholderTextColor="#9AA0A6"
							secureTextEntry
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							style={styles.input}
						/>
					)}

				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				{loading ? (
					<ActivityIndicator size="large" color="#007AFF" />
				) : (
					<TouchableOpacity style={styles.button} onPress={onSubmit}>
						<Text style={styles.buttonText}>{isRegister ? 'Daftar' : 'Masuk'}</Text>
					</TouchableOpacity>
				)}

				<View style={styles.footerRow}>
					<Text style={styles.footerText}>{isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}</Text>
					<Pressable onPress={() => { setIsRegister(!isRegister); setError(''); }}>
						<Text style={styles.footerLink}>{isRegister ? ' Masuk' : ' Daftar'}</Text>
					</Pressable>
				</View>
			</View>

      
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#F6F7FB',
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 4,
	},
	logo: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: '#007AFF',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginBottom: 12,
	},
	logoText: { color: '#fff', fontSize: 22, fontWeight: '800' },
	title: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 6,
		textAlign: 'center',
		color: '#111',
	},
	subtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 12 },
	input: {
		borderWidth: 1,
		borderColor: '#E6E9F0',
		backgroundColor: '#fff',
		padding: 12,
		marginBottom: 12,
		borderRadius: 8,
		color: '#111',
	},
	button: {
		backgroundColor: '#007AFF',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 6,
	},
	buttonText: { color: '#fff', fontWeight: '700' },
	footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
	footerText: { color: '#666' },
	footerLink: { color: '#007AFF', fontWeight: '700' },
	errorText: { color: '#B00020', textAlign: 'center', marginBottom: 8 },
});
