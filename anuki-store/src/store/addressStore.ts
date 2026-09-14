import { create } from 'zustand';
import { apiGet } from '@/lib/api';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark: string | null;
  isDefault: boolean;
}

const ADDRESS_CACHE_KEY = 'selected_address_cache';
const ADDRESS_LIST_KEY = 'address_list_cache';

interface AddressState {
  selectedAddress: Address | null;
  addresses: Address[];
  hasFetched: boolean;
  isFetching: boolean;

  /** Set the selected address and persist to localStorage */
  setSelectedAddress: (address: Address | null) => void;

  /** Fetch addresses from backend ONLY if not already fetched in this session */
  fetchAddressesOnce: () => Promise<void>;

  /** Force re-fetch (after adding/editing/deleting an address) */
  refreshAddresses: () => Promise<void>;

  /** Clear everything on logout */
  clearAddresses: () => void;

  /** Hydrate from localStorage on app load */
  hydrate: () => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  selectedAddress: null,
  addresses: [],
  hasFetched: false,
  isFetching: false,

  setSelectedAddress: (address) => {
    if (address) {
      try {
        localStorage.setItem(ADDRESS_CACHE_KEY, JSON.stringify(address));
      } catch {}
    } else {
      try {
        localStorage.removeItem(ADDRESS_CACHE_KEY);
      } catch {}
    }
    set({ selectedAddress: address });
  },

  fetchAddressesOnce: async () => {
    const { hasFetched, isFetching } = get();
    if (hasFetched || isFetching) return;

    set({ isFetching: true });
    try {
      const addresses = await apiGet<Address[]>('/addresses');
      if (addresses && addresses.length > 0) {
        try {
          localStorage.setItem(ADDRESS_LIST_KEY, JSON.stringify(addresses));
        } catch {}

        const { selectedAddress } = get();
        if (!selectedAddress) {
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          if (defaultAddr) {
            try {
              localStorage.setItem(ADDRESS_CACHE_KEY, JSON.stringify(defaultAddr));
            } catch {}
            set({ addresses, selectedAddress: defaultAddr, hasFetched: true, isFetching: false });
            return;
          }
        }
        set({ addresses, hasFetched: true, isFetching: false });
      } else {
        set({ addresses: [], hasFetched: true, isFetching: false });
      }
    } catch (err) {
      const error = err as Error & { message?: string };
      if (!error.message?.includes('401')) {
        console.error('Failed to fetch addresses:', error);
      }
      set({ hasFetched: true, isFetching: false });
    }
  },

  refreshAddresses: async () => {
    set({ isFetching: true, hasFetched: false });
    try {
      const addresses = await apiGet<Address[]>('/addresses');
      if (addresses && addresses.length > 0) {
        try {
          localStorage.setItem(ADDRESS_LIST_KEY, JSON.stringify(addresses));
        } catch {}
        const { selectedAddress } = get();
        if (selectedAddress) {
          const stillExists = addresses.find(a => a.id === selectedAddress.id);
          if (!stillExists) {
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            try {
              if (defaultAddr) localStorage.setItem(ADDRESS_CACHE_KEY, JSON.stringify(defaultAddr));
              else localStorage.removeItem(ADDRESS_CACHE_KEY);
            } catch {}
            set({ addresses, selectedAddress: defaultAddr || null, hasFetched: true, isFetching: false });
            return;
          }
          const updated = addresses.find(a => a.id === selectedAddress.id);
          if (updated) {
            try { localStorage.setItem(ADDRESS_CACHE_KEY, JSON.stringify(updated)); } catch {}
            set({ addresses, selectedAddress: updated, hasFetched: true, isFetching: false });
            return;
          }
        }
        set({ addresses, hasFetched: true, isFetching: false });
      } else {
        set({ addresses: [], selectedAddress: null, hasFetched: true, isFetching: false });
        try {
          localStorage.removeItem(ADDRESS_CACHE_KEY);
          localStorage.removeItem(ADDRESS_LIST_KEY);
        } catch {}
      }
    } catch {
      set({ hasFetched: true, isFetching: false });
    }
  },

  clearAddresses: () => {
    try {
      localStorage.removeItem(ADDRESS_CACHE_KEY);
      localStorage.removeItem(ADDRESS_LIST_KEY);
    } catch {}
    set({ selectedAddress: null, addresses: [], hasFetched: false, isFetching: false });
  },

  hydrate: () => {
    try {
      const cachedAddress = localStorage.getItem(ADDRESS_CACHE_KEY);
      const cachedList = localStorage.getItem(ADDRESS_LIST_KEY);
      if (cachedAddress) {
        set({ selectedAddress: JSON.parse(cachedAddress) });
      }
      if (cachedList) {
        set({ addresses: JSON.parse(cachedList) });
      }
    } catch {}
  },
}));
