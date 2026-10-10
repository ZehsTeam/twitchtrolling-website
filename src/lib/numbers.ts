export const formatFollowers = (count: number): string => {
	return new Intl.NumberFormat('en', {
		notation: 'compact',
		maximumSignificantDigits: 3
	}).format(count);
};
