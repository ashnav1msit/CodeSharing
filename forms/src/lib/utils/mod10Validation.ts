//! NOTE: This is a copy of the mod10Validator function within
//! libs/aedigital/utils/
//! it has been copied into this project to be used without introducing
//! an internal dependency.  Care should be taken when updating / modifying either version
/**
 * Standard validation used for SIN, ASN and Credit Card numbers
 *
 * @export
 * @param {string} inputVal
 * @return {*} 
 */
export function mod10Validator(inputVal: string) {
    if (inputVal !== null || inputVal !== undefined) {
        let digitsSum = 0;
        const reversedNumberArray = String(inputVal)
            .split('')
            .reverse()
            .map(Number);

        for (let i = 0; i < reversedNumberArray.length; i++) {
            if (i % 2 != 0) {
                let value = reversedNumberArray[i] * 2;
                let sumValue = 0;
                if (value > 9) {
                    while (value) {
                        sumValue += value % 10;
                        value = Math.floor(value / 10);
                    }
                    digitsSum += sumValue;
                } else {
                    digitsSum += value;
                }
            } else {
                digitsSum += reversedNumberArray[i];
            }
        }
        return digitsSum % 10 == 0 ? true : false;
    }
    return false;
}
