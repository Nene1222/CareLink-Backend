// Comprehensive dummy data for inventory feature

export interface Medicine {
	name: string;
	dosage?: string;
  }
  
  export interface MedicineGroup {
	id: string;
	title: string;
	totalMedicines: number;
	totalStocks: number;
	medicines: Medicine[];
  }
  
  export interface MedicineListItem {
	id: string;
	name: string;
	stock: number;
	status: 'Available' | 'Low Stock' | 'Out of Stock';
  }
  
  export interface MedicineDetailData {
	id: string;
	name: string;
	group: string;
	description: {
	  genericName: string;
	  strength: string;
	  dosageForm: string;
	  therapeuticClass: string;
	};
	stock: {
	  total: number;
	  batches: number;
	};
  }
  
  export interface Batch {
	id: string;
	batchNo: string;
	expiryDate: string;
	qty: number;
	remaining: number;
	purchaseDate: string;
  }
  
  export interface BatchDetail {
	batchNo: string;
	supplier: string;
	quantity: number;
	purchaseDate: string;
	expiryDate: string;
	purchasingPrice: number;
	settingPrice: number;
	priceUnit: string;
  }
  
  // Medicine Groups Data - Only 2 groups
  export const medicineGroupsData: MedicineGroup[] = [
	{
	  id: '1',
	  title: 'Pain Relief',
	  totalMedicines: 4,
	  totalStocks: 2150,
	  medicines: [
		{ name: 'Paracetamol', dosage: '500mg' },
		{ name: 'Ibuprofen', dosage: '400mg' },
		{ name: 'Aspirin', dosage: '100mg' },
		{ name: 'Diclofenac', dosage: '50mg' }
	  ]
	},
	{
	  id: '2',
	  title: 'Antibiotics',
	  totalMedicines: 5,
	  totalStocks: 1820,
	  medicines: [
		{ name: 'Amoxicillin', dosage: '250mg' },
		{ name: 'Ciprofloxacin', dosage: '500mg' },
		{ name: 'Azithromycin', dosage: '250mg' },
		{ name: 'Cephalexin', dosage: '500mg' },
		{ name: 'Doxycycline', dosage: '100mg' }
	  ]
	}
  ];
  
  // Medicines by Group
  export const medicinesByGroup: { [key: string]: MedicineListItem[] } = {
	'Pain Relief': [
	  { id: 'med-1', name: 'Paracetamol 500mg', stock: 750, status: 'Available' },
	  { id: 'med-2', name: 'Ibuprofen 400mg', stock: 520, status: 'Available' },
	  { id: 'med-3', name: 'Aspirin 100mg', stock: 480, status: 'Available' },
	  { id: 'med-4', name: 'Diclofenac 50mg', stock: 400, status: 'Available' }
	],
	'Antibiotics': [
	  { id: 'med-5', name: 'Amoxicillin 250mg', stock: 320, status: 'Available' },
	  { id: 'med-6', name: 'Ciprofloxacin 500mg', stock: 280, status: 'Available' },
	  { id: 'med-7', name: 'Azithromycin 250mg', stock: 95, status: 'Low Stock' },
	  { id: 'med-8', name: 'Cephalexin 500mg', stock: 450, status: 'Available' },
	  { id: 'med-9', name: 'Doxycycline 100mg', stock: 0, status: 'Out of Stock' },
	  { id: 'med-10', name: 'Erythromycin 250mg', stock: 175, status: 'Available' }
	],
	'Vitamins & Supplements': [
	  { id: 'med-11', name: 'Vitamin C 1000mg', stock: 850, status: 'Available' },
	  { id: 'med-12', name: 'Vitamin D3 2000 IU', stock: 620, status: 'Available' },
	  { id: 'med-13', name: 'Multivitamin Tablet', stock: 480, status: 'Available' },
	  { id: 'med-14', name: 'Calcium 500mg', stock: 550, status: 'Available' },
	  { id: 'med-15', name: 'Iron 65mg', stock: 420, status: 'Available' },
	  { id: 'med-16', name: 'Zinc 50mg', stock: 280, status: 'Available' }
	],
	'Cardiovascular': [
	  { id: 'med-17', name: 'Atenolol 50mg', stock: 380, status: 'Available' },
	  { id: 'med-18', name: 'Amlodipine 5mg', stock: 320, status: 'Available' },
	  { id: 'med-19', name: 'Losartan 50mg', stock: 85, status: 'Low Stock' },
	  { id: 'med-20', name: 'Metoprolol 25mg', stock: 665, status: 'Available' }
	],
	'Gastrointestinal': [
	  { id: 'med-21', name: 'Omeprazole 20mg', stock: 450, status: 'Available' },
	  { id: 'med-22', name: 'Ranitidine 150mg', stock: 380, status: 'Available' },
	  { id: 'med-23', name: 'Metoclopramide 10mg', stock: 95, status: 'Low Stock' },
	  { id: 'med-24', name: 'Loperamide 2mg', stock: 420, status: 'Available' },
	  { id: 'med-25', name: 'Antacid Tablet', stock: 635, status: 'Available' }
	],
	'Respiratory': [
	  { id: 'med-26', name: 'Salbutamol 100mcg', stock: 420, status: 'Available' },
	  { id: 'med-27', name: 'Budesonide 200mcg', stock: 380, status: 'Available' },
	  { id: 'med-28', name: 'Montelukast 10mg', stock: 450, status: 'Available' },
	  { id: 'med-29', name: 'Cetirizine 10mg', stock: 400, status: 'Available' }
	]
  };
  
  // Medicine Details Data
  export const medicineDetailsData: { [key: string]: MedicineDetailData } = {
	'med-1': {
	  id: 'med-1',
	  name: 'Paracetamol 500mg',
	  group: 'Pain Relief',
	  description: {
		genericName: 'Paracetamol (also known as Acetaminophen)',
		strength: '500 mg',
		dosageForm: 'Tablet',
		therapeuticClass: 'Analgesic and Antipyretic'
	  },
	  stock: { total: 750, batches: 3 }
	},
	'med-2': {
	  id: 'med-2',
	  name: 'Ibuprofen 400mg',
	  group: 'Pain Relief',
	  description: {
		genericName: 'Ibuprofen',
		strength: '400 mg',
		dosageForm: 'Tablet',
		therapeuticClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID)'
	  },
	  stock: { total: 520, batches: 2 }
	},
	'med-3': {
	  id: 'med-3',
	  name: 'Aspirin 100mg',
	  group: 'Pain Relief',
	  description: {
		genericName: 'Acetylsalicylic Acid',
		strength: '100 mg',
		dosageForm: 'Tablet',
		therapeuticClass: 'Antiplatelet and Analgesic'
	  },
	  stock: { total: 480, batches: 2 }
	},
	'med-4': {
	  id: 'med-4',
	  name: 'Diclofenac 50mg',
	  group: 'Pain Relief',
	  description: {
		genericName: 'Diclofenac Sodium',
		strength: '50 mg',
		dosageForm: 'Tablet',
		therapeuticClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID)'
	  },
	  stock: { total: 400, batches: 2 }
	},
	'med-5': {
	  id: 'med-5',
	  name: 'Amoxicillin 250mg',
	  group: 'Antibiotics',
	  description: {
		genericName: 'Amoxicillin',
		strength: '250 mg',
		dosageForm: 'Capsule',
		therapeuticClass: 'Penicillin Antibiotic'
	  },
	  stock: { total: 320, batches: 2 }
	},
	'med-6': {
	  id: 'med-6',
	  name: 'Ciprofloxacin 500mg',
	  group: 'Antibiotics',
	  description: {
		genericName: 'Ciprofloxacin Hydrochloride',
		strength: '500 mg',
		dosageForm: 'Tablet',
		therapeuticClass: 'Fluoroquinolone Antibiotic'
	  },
	  stock: { total: 280, batches: 2 }
	},
	'med-7': {
	  id: 'med-7',
	  name: 'Azithromycin 250mg',
	  group: 'Antibiotics',
	  description: {
		genericName: 'Azithromycin',
		strength: '250 mg',
		dosageForm: 'Capsule',
		therapeuticClass: 'Macrolide Antibiotic'
	  },
	  stock: { total: 95, batches: 1 }
	},
	'med-8': {
	  id: 'med-8',
	  name: 'Cephalexin 500mg',
	  group: 'Antibiotics',
	  description: {
		genericName: 'Cephalexin',
		strength: '500 mg',
		dosageForm: 'Capsule',
		therapeuticClass: 'Cephalosporin Antibiotic'
	  },
	  stock: { total: 450, batches: 3 }
	},
	'med-9': {
	  id: 'med-9',
	  name: 'Doxycycline 100mg',
	  group: 'Antibiotics',
	  description: {
		genericName: 'Doxycycline Hyclate',
		strength: '100 mg',
		dosageForm: 'Capsule',
		therapeuticClass: 'Tetracycline Antibiotic'
	  },
	  stock: { total: 0, batches: 0 }
	},
	'med-11': {
	  id: 'med-11',
	  name: 'Vitamin C 1000mg',
	  group: 'Vitamins & Supplements',
	  description: {
		genericName: 'Ascorbic Acid',
		strength: '1000 mg',
		dosageForm: 'Tablet',
		therapeuticClass: 'Vitamin Supplement'
	  },
	  stock: { total: 850, batches: 4 }
	},
	'med-12': {
	  id: 'med-12',
	  name: 'Vitamin D3 2000 IU',
	  group: 'Vitamins & Supplements',
	  description: {
		genericName: 'Cholecalciferol',
		strength: '2000 IU',
		dosageForm: 'Softgel Capsule',
		therapeuticClass: 'Vitamin Supplement'
	  },
	  stock: { total: 620, batches: 3 }
	},
	'med-17': {
	  id: 'med-17',
	  name: 'Atenolol 50mg',
	  group: 'Cardiovascular',
	  description: {
		genericName: 'Atenolol',
		strength: '50 mg',
		dosageForm: 'Tablet',
		therapeuticClass: 'Beta-blocker'
	  },
	  stock: { total: 380, batches: 2 }
	},
	'med-21': {
	  id: 'med-21',
	  name: 'Omeprazole 20mg',
	  group: 'Gastrointestinal',
	  description: {
		genericName: 'Omeprazole',
		strength: '20 mg',
		dosageForm: 'Capsule',
		therapeuticClass: 'Proton Pump Inhibitor'
	  },
	  stock: { total: 450, batches: 2 }
	},
	'med-26': {
	  id: 'med-26',
	  name: 'Salbutamol 100mcg',
	  group: 'Respiratory',
	  description: {
		genericName: 'Salbutamol Sulfate',
		strength: '100 mcg',
		dosageForm: 'Inhaler',
		therapeuticClass: 'Bronchodilator'
	  },
	  stock: { total: 420, batches: 3 }
	}
  };
  
  // Batches Data by Medicine ID
  export const batchesByMedicine: { [key: string]: Batch[] } = {
	'med-1': [
	  { id: 'batch-1-1', batchNo: 'B98332', expiryDate: '2027-09-30', qty: 500, remaining: 500, purchaseDate: '2026-06-15' },
	  { id: 'batch-1-2', batchNo: 'B49324', expiryDate: '2026-06-15', qty: 300, remaining: 200, purchaseDate: '2025-08-19' },
	  { id: 'batch-1-3', batchNo: 'B28342', expiryDate: '2025-12-20', qty: 200, remaining: 50, purchaseDate: '2024-11-10' }
	],
	'med-2': [
	  { id: 'batch-2-1', batchNo: 'B78291', expiryDate: '2027-03-15', qty: 300, remaining: 300, purchaseDate: '2026-01-20' },
	  { id: 'batch-2-2', batchNo: 'B56218', expiryDate: '2026-08-30', qty: 220, remaining: 220, purchaseDate: '2025-09-10' }
	],
	'med-3': [
	  { id: 'batch-3-1', batchNo: 'B39472', expiryDate: '2027-05-20', qty: 250, remaining: 250, purchaseDate: '2026-02-15' },
	  { id: 'batch-3-2', batchNo: 'B28461', expiryDate: '2026-11-10', qty: 230, remaining: 230, purchaseDate: '2025-10-05' }
	],
	'med-4': [
	  { id: 'batch-4-1', batchNo: 'B67293', expiryDate: '2027-01-25', qty: 200, remaining: 200, purchaseDate: '2026-03-10' },
	  { id: 'batch-4-2', batchNo: 'B48271', expiryDate: '2026-07-18', qty: 200, remaining: 200, purchaseDate: '2025-08-22' }
	],
	'med-5': [
	  { id: 'batch-5-1', batchNo: 'B59284', expiryDate: '2026-12-30', qty: 180, remaining: 180, purchaseDate: '2025-11-15' },
	  { id: 'batch-5-2', batchNo: 'B38472', expiryDate: '2026-05-20', qty: 140, remaining: 140, purchaseDate: '2025-04-10' }
	],
	'med-6': [
	  { id: 'batch-6-1', batchNo: 'B48291', expiryDate: '2027-02-14', qty: 150, remaining: 150, purchaseDate: '2026-01-25' },
	  { id: 'batch-6-2', batchNo: 'B37284', expiryDate: '2026-09-30', qty: 130, remaining: 130, purchaseDate: '2025-08-15' }
	],
	'med-7': [
	  { id: 'batch-7-1', batchNo: 'B28473', expiryDate: '2026-04-15', qty: 95, remaining: 95, purchaseDate: '2025-03-20' }
	],
	'med-8': [
	  { id: 'batch-8-1', batchNo: 'B67284', expiryDate: '2027-06-20', qty: 200, remaining: 200, purchaseDate: '2026-02-10' },
	  { id: 'batch-8-2', batchNo: 'B48261', expiryDate: '2026-10-15', qty: 150, remaining: 150, purchaseDate: '2025-09-05' },
	  { id: 'batch-8-3', batchNo: 'B37295', expiryDate: '2026-03-30', qty: 100, remaining: 100, purchaseDate: '2025-02-18' }
	],
	'med-11': [
	  { id: 'batch-11-1', batchNo: 'B89274', expiryDate: '2027-08-30', qty: 250, remaining: 250, purchaseDate: '2026-05-20' },
	  { id: 'batch-11-2', batchNo: 'B78261', expiryDate: '2027-01-15', qty: 200, remaining: 200, purchaseDate: '2025-12-10' },
	  { id: 'batch-11-3', batchNo: 'B67248', expiryDate: '2026-11-20', qty: 200, remaining: 200, purchaseDate: '2025-10-15' },
	  { id: 'batch-11-4', batchNo: 'B58293', expiryDate: '2026-06-10', qty: 200, remaining: 200, purchaseDate: '2025-05-22' }
	],
	'med-12': [
	  { id: 'batch-12-1', batchNo: 'B48274', expiryDate: '2027-04-20', qty: 220, remaining: 220, purchaseDate: '2026-01-15' },
	  { id: 'batch-12-2', batchNo: 'B37261', expiryDate: '2026-10-30', qty: 200, remaining: 200, purchaseDate: '2025-09-20' },
	  { id: 'batch-12-3', batchNo: 'B28495', expiryDate: '2026-05-15', qty: 200, remaining: 200, purchaseDate: '2025-04-10' }
	],
	'med-17': [
	  { id: 'batch-17-1', batchNo: 'B59284', expiryDate: '2027-02-28', qty: 200, remaining: 200, purchaseDate: '2026-01-10' },
	  { id: 'batch-17-2', batchNo: 'B48273', expiryDate: '2026-08-15', qty: 180, remaining: 180, purchaseDate: '2025-07-20' }
	],
	'med-21': [
	  { id: 'batch-21-1', batchNo: 'B67284', expiryDate: '2027-03-30', qty: 250, remaining: 250, purchaseDate: '2026-02-15' },
	  { id: 'batch-21-2', batchNo: 'B58261', expiryDate: '2026-09-20', qty: 200, remaining: 200, purchaseDate: '2025-08-10' }
	],
	'med-26': [
	  { id: 'batch-26-1', batchNo: 'B48274', expiryDate: '2027-01-15', qty: 150, remaining: 150, purchaseDate: '2026-01-05' },
	  { id: 'batch-26-2', batchNo: 'B37261', expiryDate: '2026-07-30', qty: 140, remaining: 140, purchaseDate: '2025-06-20' },
	  { id: 'batch-26-3', batchNo: 'B28495', expiryDate: '2026-04-10', qty: 130, remaining: 130, purchaseDate: '2025-03-15' }
	]
  };
  
  // Batch Details Data
  export const batchDetailsData: { [key: string]: BatchDetail } = {
	'batch-1-1': {
	  batchNo: 'B98332',
	  supplier: 'ABC Pharma',
	  quantity: 500,
	  purchaseDate: '2024-10-10',
	  expiryDate: '2027-09-30',
	  purchasingPrice: 0.15,
	  settingPrice: 0.60,
	  priceUnit: 'Tablet'
	},
	'batch-1-2': {
	  batchNo: 'B49324',
	  supplier: 'XYZ Pharmaceuticals',
	  quantity: 300,
	  purchaseDate: '2025-08-19',
	  expiryDate: '2026-06-15',
	  purchasingPrice: 0.18,
	  settingPrice: 0.65,
	  priceUnit: 'Tablet'
	},
	'batch-1-3': {
	  batchNo: 'B28342',
	  supplier: 'MedSupply Co',
	  quantity: 200,
	  purchaseDate: '2024-11-10',
	  expiryDate: '2025-12-20',
	  purchasingPrice: 0.16,
	  settingPrice: 0.62,
	  priceUnit: 'Tablet'
	},
	'batch-2-1': {
	  batchNo: 'B78291',
	  supplier: 'Global Med Solutions',
	  quantity: 300,
	  purchaseDate: '2026-01-20',
	  expiryDate: '2027-03-15',
	  purchasingPrice: 0.25,
	  settingPrice: 0.85,
	  priceUnit: 'Tablet'
	},
	'batch-2-2': {
	  batchNo: 'B56218',
	  supplier: 'Pharma Distributors',
	  quantity: 220,
	  purchaseDate: '2025-09-10',
	  expiryDate: '2026-08-30',
	  purchasingPrice: 0.28,
	  settingPrice: 0.90,
	  priceUnit: 'Tablet'
	},
	'batch-3-1': {
	  batchNo: 'B39472',
	  supplier: 'HealthCare Supplies',
	  quantity: 250,
	  purchaseDate: '2026-02-15',
	  expiryDate: '2027-05-20',
	  purchasingPrice: 0.12,
	  settingPrice: 0.50,
	  priceUnit: 'Tablet'
	},
	'batch-3-2': {
	  batchNo: 'B28461',
	  supplier: 'MediCorp',
	  quantity: 230,
	  purchaseDate: '2025-10-05',
	  expiryDate: '2026-11-10',
	  purchasingPrice: 0.13,
	  settingPrice: 0.52,
	  priceUnit: 'Tablet'
	},
	'batch-4-1': {
	  batchNo: 'B67293',
	  supplier: 'PharmaLink',
	  quantity: 200,
	  purchaseDate: '2026-03-10',
	  expiryDate: '2027-01-25',
	  purchasingPrice: 0.30,
	  settingPrice: 1.00,
	  priceUnit: 'Tablet'
	},
	'batch-4-2': {
	  batchNo: 'B48271',
	  supplier: 'MedSupply Co',
	  quantity: 200,
	  purchaseDate: '2025-08-22',
	  expiryDate: '2026-07-18',
	  purchasingPrice: 0.32,
	  settingPrice: 1.05,
	  priceUnit: 'Tablet'
	},
	'batch-5-1': {
	  batchNo: 'B59284',
	  supplier: 'ABC Pharma',
	  quantity: 180,
	  purchaseDate: '2025-11-15',
	  expiryDate: '2026-12-30',
	  purchasingPrice: 0.20,
	  settingPrice: 0.75,
	  priceUnit: 'Capsule'
	},
	'batch-5-2': {
	  batchNo: 'B38472',
	  supplier: 'XYZ Pharmaceuticals',
	  quantity: 140,
	  purchaseDate: '2025-04-10',
	  expiryDate: '2026-05-20',
	  purchasingPrice: 0.22,
	  settingPrice: 0.80,
	  priceUnit: 'Capsule'
	},
	'batch-6-1': {
	  batchNo: 'B48291',
	  supplier: 'Global Med Solutions',
	  quantity: 150,
	  purchaseDate: '2026-01-25',
	  expiryDate: '2027-02-14',
	  purchasingPrice: 0.35,
	  settingPrice: 1.20,
	  priceUnit: 'Tablet'
	},
	'batch-6-2': {
	  batchNo: 'B37284',
	  supplier: 'Pharma Distributors',
	  quantity: 130,
	  purchaseDate: '2025-08-15',
	  expiryDate: '2026-09-30',
	  purchasingPrice: 0.38,
	  settingPrice: 1.25,
	  priceUnit: 'Tablet'
	},
	'batch-7-1': {
	  batchNo: 'B28473',
	  supplier: 'HealthCare Supplies',
	  quantity: 95,
	  purchaseDate: '2025-03-20',
	  expiryDate: '2026-04-15',
	  purchasingPrice: 0.40,
	  settingPrice: 1.50,
	  priceUnit: 'Capsule'
	},
	'batch-8-1': {
	  batchNo: 'B67284',
	  supplier: 'MediCorp',
	  quantity: 200,
	  purchaseDate: '2026-02-10',
	  expiryDate: '2027-06-20',
	  purchasingPrice: 0.18,
	  settingPrice: 0.70,
	  priceUnit: 'Capsule'
	},
	'batch-8-2': {
	  batchNo: 'B48261',
	  supplier: 'PharmaLink',
	  quantity: 150,
	  purchaseDate: '2025-09-05',
	  expiryDate: '2026-10-15',
	  purchasingPrice: 0.20,
	  settingPrice: 0.75,
	  priceUnit: 'Capsule'
	},
	'batch-8-3': {
	  batchNo: 'B37295',
	  supplier: 'MedSupply Co',
	  quantity: 100,
	  purchaseDate: '2025-02-18',
	  expiryDate: '2026-03-30',
	  purchasingPrice: 0.19,
	  settingPrice: 0.72,
	  priceUnit: 'Capsule'
	},
	'batch-11-1': {
	  batchNo: 'B89274',
	  supplier: 'Vitamins Plus',
	  quantity: 250,
	  purchaseDate: '2026-05-20',
	  expiryDate: '2027-08-30',
	  purchasingPrice: 0.10,
	  settingPrice: 0.40,
	  priceUnit: 'Tablet'
	},
	'batch-11-2': {
	  batchNo: 'B78261',
	  supplier: 'HealthSupplies',
	  quantity: 200,
	  purchaseDate: '2025-12-10',
	  expiryDate: '2027-01-15',
	  purchasingPrice: 0.12,
	  settingPrice: 0.45,
	  priceUnit: 'Tablet'
	},
	'batch-11-3': {
	  batchNo: 'B67248',
	  supplier: 'NutriCorp',
	  quantity: 200,
	  purchaseDate: '2025-10-15',
	  expiryDate: '2026-11-20',
	  purchasingPrice: 0.11,
	  settingPrice: 0.42,
	  priceUnit: 'Tablet'
	},
	'batch-11-4': {
	  batchNo: 'B58293',
	  supplier: 'ABC Pharma',
	  quantity: 200,
	  purchaseDate: '2025-05-22',
	  expiryDate: '2026-06-10',
	  purchasingPrice: 0.10,
	  settingPrice: 0.40,
	  priceUnit: 'Tablet'
	},
	'batch-12-1': {
	  batchNo: 'B48274',
	  supplier: 'Vitamins Plus',
	  quantity: 220,
	  purchaseDate: '2026-01-15',
	  expiryDate: '2027-04-20',
	  purchasingPrice: 0.15,
	  settingPrice: 0.60,
	  priceUnit: 'Capsule'
	},
	'batch-12-2': {
	  batchNo: 'B37261',
	  supplier: 'HealthSupplies',
	  quantity: 200,
	  purchaseDate: '2025-09-20',
	  expiryDate: '2026-10-30',
	  purchasingPrice: 0.16,
	  settingPrice: 0.65,
	  priceUnit: 'Capsule'
	},
	'batch-12-3': {
	  batchNo: 'B28495',
	  supplier: 'NutriCorp',
	  quantity: 200,
	  purchaseDate: '2025-04-10',
	  expiryDate: '2026-05-15',
	  purchasingPrice: 0.15,
	  settingPrice: 0.60,
	  priceUnit: 'Capsule'
	},
	'batch-17-1': {
	  batchNo: 'B59284',
	  supplier: 'CardioMed',
	  quantity: 200,
	  purchaseDate: '2026-01-10',
	  expiryDate: '2027-02-28',
	  purchasingPrice: 0.25,
	  settingPrice: 1.00,
	  priceUnit: 'Tablet'
	},
	'batch-17-2': {
	  batchNo: 'B48273',
	  supplier: 'HeartCare Pharma',
	  quantity: 180,
	  purchaseDate: '2025-07-20',
	  expiryDate: '2026-08-15',
	  purchasingPrice: 0.27,
	  settingPrice: 1.05,
	  priceUnit: 'Tablet'
	},
	'batch-21-1': {
	  batchNo: 'B67284',
	  supplier: 'GastroMed',
	  quantity: 250,
	  purchaseDate: '2026-02-15',
	  expiryDate: '2027-03-30',
	  purchasingPrice: 0.22,
	  settingPrice: 0.90,
	  priceUnit: 'Capsule'
	},
	'batch-21-2': {
	  batchNo: 'B58261',
	  supplier: 'Digestive Health',
	  quantity: 200,
	  purchaseDate: '2025-08-10',
	  expiryDate: '2026-09-20',
	  purchasingPrice: 0.24,
	  settingPrice: 0.95,
	  priceUnit: 'Capsule'
	},
	'batch-26-1': {
	  batchNo: 'B48274',
	  supplier: 'Respiratory Care',
	  quantity: 150,
	  purchaseDate: '2026-01-05',
	  expiryDate: '2027-01-15',
	  purchasingPrice: 2.50,
	  settingPrice: 8.00,
	  priceUnit: 'Inhaler'
	},
	'batch-26-2': {
	  batchNo: 'B37261',
	  supplier: 'LungHealth Pharma',
	  quantity: 140,
	  purchaseDate: '2025-06-20',
	  expiryDate: '2026-07-30',
	  purchasingPrice: 2.60,
	  settingPrice: 8.50,
	  priceUnit: 'Inhaler'
	},
	'batch-26-3': {
	  batchNo: 'B28495',
	  supplier: 'BreathEasy Supplies',
	  quantity: 130,
	  purchaseDate: '2025-03-15',
	  expiryDate: '2026-04-10',
	  purchasingPrice: 2.55,
	  settingPrice: 8.20,
	  priceUnit: 'Inhaler'
	}
  };
  
  // Helper function to get medicines for a group
  export const getMedicinesByGroup = (groupName: string): MedicineListItem[] => {
	return medicinesByGroup[groupName] || [];
  };
  
  // Helper function to get medicine detail
  export const getMedicineDetail = (medicineId: string): MedicineDetailData | null => {
	return medicineDetailsData[medicineId] || null;
  };
  
  // Helper function to get batches for a medicine
  export const getBatchesByMedicine = (medicineId: string): Batch[] => {
	return batchesByMedicine[medicineId] || [];
  };
  
  // Helper function to get batch detail
  export const getBatchDetail = (batchId: string): BatchDetail | null => {
	return batchDetailsData[batchId] || null;
  };
  
  