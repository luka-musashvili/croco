import levenshtein from "fast-levenshtein";

export const validateEmail = (email: string): boolean => {
	// სტანდარტული მეილის ვალიდაცია regex-ით
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePasswordStrength = (password: string): boolean => {
	// best practice-ებიდან ავიღე - პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, 1 რიცხვს, 1 დიდ და ერთ პატარა ასოს
	const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w_]{8,}$/;
	return passwordStrengthRegex.test(password);
};

export const validatePasswordSimilarity = (password: string, email: string): boolean => {
	const localPart = email.split("@")[0]; // მეილიდან ვიღებ local part-ს (test@crocobet.com -> "test")
	const distance = levenshtein.get(password, localPart); //ვიყენებ ლევენშტეინის დისტანციის ალგორითმს
	const similarityThreshold = 5; // best practice-ებიდან ავიღე 5-იანი მსგავსების ბარიერი
	return distance > similarityThreshold;
};

// ზოგადად პაროლის ვალიდაციისთვის (scalability)-ისთვის, ამჟამად არ ვიყენებ პროექტში, რადგან უფრო კონკრეტული error handling მინდა მომხმარებლის რეგისტრაციის დროს
export const validatePassword = (password: string, email: string): boolean => {
	return validatePasswordStrength(password) && validatePasswordSimilarity(password, email);
};
