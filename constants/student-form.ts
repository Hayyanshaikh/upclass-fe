export const genderOptions = ["Female", "Male", "Other"].map((value) => ({ label: value, value }));
export const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((value) => ({ label: value, value }));
export const classOptions = Array.from({ length: 10 }, (_, index) => ({ label: `Class ${index + 1}`, value: String(index + 1) }));
export const sectionOptions = ["A", "B", "C"].map((value) => ({ label: value, value }));
export const statusOptions = ["Active", "Inactive"].map((value) => ({ label: value, value }));
export const relationOptions = ["Father", "Mother", "Guardian"].map((value) => ({ label: value, value }));
