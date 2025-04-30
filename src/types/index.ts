export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
  }
  
  export interface Url {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    visitCount: number;
    createdAt: string;
  }

  export interface UrlModel {
    id: string;
    shortCode: string;
    shortUrl: string;
    _doc: {
      _id:string;
      originalUrl: string;
      visitCount: number;
      createdAt: string;
      userId:string
    }

  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    status: number;
  }