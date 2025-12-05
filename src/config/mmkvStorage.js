import { MMKV } from 'react-native-mmkv';

let storage = null;
let isMMKVAvailable = false;
const inMemory = {}; // fallback storage when MMKV / JSI is unavailable (dev or remote debugger)

try {
	// Attempt to create MMKV instance. This will throw when remote JS debugger is enabled
	// because JSI/native synchronous calls are not available.
	storage = new MMKV();
	isMMKVAvailable = true;
} catch (e) {
	// MMKV not available (e.g. remote debugger). Use in-memory fallback to avoid app crash.
	// Do not rethrow so app can continue in debugging scenarios.
	// eslint-disable-next-line no-console
	console.warn('MMKV not available, using in-memory fallback. Disable remote JS debugging to use MMKV.', e && e.message);
	storage = null;
}

const USER_KEY = 'user';

export const saveUser = (user) => {
	try {
		if (isMMKVAvailable && storage) {
			storage.set(USER_KEY, JSON.stringify(user));
		} else {
			inMemory[USER_KEY] = JSON.stringify(user);
		}
	} catch (e) {
		// ignore errors in storage
	}
};

export const getUser = () => {
	try {
		if (isMMKVAvailable && storage) {
			const raw = storage.getString(USER_KEY);
			return raw ? JSON.parse(raw) : null;
		}
		const raw = inMemory[USER_KEY];
		return raw ? JSON.parse(raw) : null;
	} catch (e) {
		return null;
	}
};

export const clearUser = () => {
	try {
		if (isMMKVAvailable && storage) {
			storage.delete(USER_KEY);
		} else {
			delete inMemory[USER_KEY];
		}
	} catch (e) {
		// ignore
	}
};

export const isAvailable = () => isMMKVAvailable;

export default storage;
