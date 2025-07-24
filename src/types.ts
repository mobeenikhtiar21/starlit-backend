export interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'volunteer' | 'staff' | 'beneficiary';
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  skills?: string[];
  availability?: string;
  preferences?: string[];
  photoUrl?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  imageUrl: string;
  location: string;
  beneficiaries: number;
  gofundmeUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'volunteer';
  description: string;
  requirements: string[];
  postedDate: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: Text;
  category: 'apparel' | 'lighthouse' | 'care-package';
  inStock: boolean;
}

export interface Donation {
  id: string;
  amount: number;
  programId?: string;
  donorName: string;
  message?: string;
  date: string;
  paymentMethod: 'paypal' | 'card';
} 