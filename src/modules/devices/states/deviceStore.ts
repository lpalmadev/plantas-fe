import { create } from 'zustand';
import { deviceService } from "../services/deviceService";
import type { Device, CreateDeviceDTO, UpdateDeviceDTO, DeviceFilters } from "../lib/types";
import { mapErrorMessage } from "../utils/errorMapper";

interface DeviceState {
    devices: Device[];
    isLoading: boolean;
    error: string | null;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    regenerating: boolean;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    regenerateError: string | null;
    lastCreatedLinkingCode: string | null;
    totalItems: number;
    totalPages: number;
    filters: DeviceFilters;

    selectedDevice: Device | null;
    selectedDeviceLoading: boolean;
    selectedDeviceError: string | null;

    fetchDevices: () => Promise<void>;
    createDevice: (data: CreateDeviceDTO) => Promise<void>;
    updateDevice: (deviceId: string, data: UpdateDeviceDTO) => Promise<void>;
    regenerateKey: (deviceId: string) => Promise<void>;
    clearLastCreatedCode: () => void;
    setFilters: (filters: Partial<DeviceFilters>) => void;

    fetchDeviceById: (deviceId: string) => Promise<void>;
    clearSelectedDevice: () => void;

    clearCreateError: () => void;
    clearUpdateError: () => void;
    clearRegenerateError: () => void;
}

const initialFilters: DeviceFilters = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'identifier',
    sortOrder: 'asc'
};

export const useDeviceStore = create<DeviceState>((set, get) => ({
    devices: [],
    isLoading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    regenerating: false,
    createError: null,
    updateError: null,
    deleteError: null,
    regenerateError: null,
    lastCreatedLinkingCode: null,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,

    selectedDevice: null,
    selectedDeviceLoading: false,
    selectedDeviceError: null,

    fetchDevices: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await deviceService.getAllDevices(get().filters);
            set({
                devices: response.data,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages,
                isLoading: false
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: mapErrorMessage(error)
            });
        }
    },

    createDevice: async (data: CreateDeviceDTO) => {
        set({ creating: true, createError: null });
        try {
            const response = await deviceService.createDevice(data);
            set({ lastCreatedLinkingCode: response.linking_code || null });
            await get().fetchDevices();
            set({ creating: false });
        } catch (error: any) {
            set({
                creating: false,
                createError: mapErrorMessage(error)
            });
            throw error;
        }
    },

    updateDevice: async (deviceId: string, data: UpdateDeviceDTO) => {
        set({ updating: true, updateError: null });
        try {
            await deviceService.updateDevice(deviceId, data);
            await get().fetchDevices();
            set({ updating: false });
        } catch (error: any) {
            set({
                updating: false,
                updateError: mapErrorMessage(error)
            });
            throw error;
        }
    },

    regenerateKey: async (deviceId: string) => {
        set({ regenerating: true, regenerateError: null });
        try {
            const response = await deviceService.regenerateKey(deviceId);
            set({ lastCreatedLinkingCode: response.linking_code });
            await get().fetchDevices();
            set({ regenerating: false });
        } catch (error: any) {
            set({
                regenerating: false,
                regenerateError: mapErrorMessage(error)
            });
            throw error;
        }
    },

    clearLastCreatedCode: () => {
        set({ lastCreatedLinkingCode: null });
    },

    setFilters: (filters: Partial<DeviceFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchDevices();
    },

    fetchDeviceById: async (deviceId: string) => {
        set({ selectedDeviceLoading: true, selectedDeviceError: null });
        try {
            const device = await deviceService.getDeviceById(deviceId);
            set({ selectedDevice: device, selectedDeviceLoading: false });
        } catch (error: any) {
            set({
                selectedDevice: null,
                selectedDeviceLoading: false,
                selectedDeviceError: mapErrorMessage(error)
            });
        }
    },

    clearSelectedDevice: () => {
        set({ selectedDevice: null, selectedDeviceError: null });
    },

    clearCreateError: () => set({ createError: null }),
    clearUpdateError: () => set({ updateError: null }),
    clearRegenerateError: () => set({ regenerateError: null }),
}));