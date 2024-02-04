/**
 * Use this for small lists or constants that
 * do not have to be fetched from an API
 * */
export const staticData = {
    /** Map of American - (state) => (state code) */
    uStates: {
        Alabama: 'AL',
        Alaska: 'AK',
        Arizona: 'AZ',
        Arkansas: 'AR',
        California: 'CA',
        Colorado: 'CO',
        Connecticut: 'CT',
        Delaware: 'DE',
        Florida: 'FL',
        Georgia: 'GA',
        Hawaii: 'HI',
        Idaho: 'ID',
        Illinois: 'IL',
        Indiana: 'IN',
        Iowa: 'IA',
        Kansas: 'KS',
        Kentucky: 'KY',
        Louisiana: 'LA',
        Maine: 'ME',
        Maryland: 'MD',
        Massachusetts: 'MA',
        Michigan: 'MI',
        Minnesota: 'MN',
        Mississippi: 'MS',
        Missouri: 'MO',
        Montana: 'MT',
        Nebraska: 'NE',
        Nevada: 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        Ohio: 'OH',
        Oklahoma: 'OK',
        Oregon: 'OR',
        Pennsylvania: 'PA',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        Tennessee: 'TN',
        Texas: 'TX',
        Utah: 'UT',
        Vermont: 'VT',
        Virginia: 'VA',
        Washington: 'WA',
        'West Virginia': 'WV',
        Wisconsin: 'WI',
        Wyoming: 'WY',
    } as Record<string, string>,
    /** Common Regex patterns */
    regexes: {
        ssn: /^\d{9}$/,
        legalName: /^[A-Za-z ]*$/,
        zipCode: /^\d{5}(-\d{4})?$/,
        city: /^[0-9A-Za-z\s. ',-]+$/,
        address: /^[0-9A-Za-z\s. ',-]+$/,
        apartment: /^[0-9A-Za-z\s. ',-]+$/,
        guid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        phoneNumber:
            /^(?:(?:\+1|1)?[-. ]?)?\(?([2-9][0-9]{2})\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/,
    },
};

export function deleteEmptyProperties(data: Record<string, unknown>) {
    for (const key in data)
        if (data[key] === '' || data[key] === null) delete data[key];
}
