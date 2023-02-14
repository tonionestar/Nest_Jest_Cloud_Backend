import { CountryRecord } from "../models/Country";

class Country {
    // Country details
    private countries: Record<string, CountryRecord> = {
        "AD": {
            "id": 6,
            "name": "Andorra",
            "native": "Andorra",
            "phone": "376",
            "continent": "EU",
            "capital": "Andorra la Vella",
            "currency": "EUR",
            "languages": [
                "ca"
            ],
            "iso3": "AND"
        },
        "AE": {
            "id": 237,
            "name": "United Arab Emirates",
            "native": "دولة الإمارات العربية المتحدة",
            "phone": "971",
            "continent": "AS",
            "capital": "Abu Dhabi",
            "currency": "AED",
            "languages": [
                "ar"
            ],
            "iso3": "ARE"
        },
        "AF": {
            "id": 1,
            "name": "Afghanistan",
            "native": "افغانستان",
            "phone": "93",
            "continent": "AS",
            "capital": "Kabul",
            "currency": "AFN",
            "languages": [
                "ps",
                "uz",
                "tk"
            ],
            "iso3": "AFG"
        },
        "AG": {
            "id": 10,
            "name": "Antigua and Barbuda",
            "native": "Antigua and Barbuda",
            "phone": "1268",
            "continent": "NA",
            "capital": "Saint John's",
            "currency": "XCD",
            "languages": [
                "en"
            ],
            "iso3": "ATG"
        },
        "AI": {
            "id": 8,
            "name": "Anguilla",
            "native": "Anguilla",
            "phone": "1264",
            "continent": "NA",
            "capital": "The Valley",
            "currency": "XCD",
            "languages": [
                "en"
            ],
            "iso3": "AIA"
        },
        "AL": {
            "id": 3,
            "name": "Albania",
            "native": "Shqipëria",
            "phone": "355",
            "continent": "EU",
            "capital": "Tirana",
            "currency": "ALL",
            "languages": [
                "sq"
            ],
            "iso3": "ALB"
        },
        "AM": {
            "id": 12,
            "name": "Armenia",
            "native": "Հայաստան",
            "phone": "374",
            "continent": "AS",
            "capital": "Yerevan",
            "currency": "AMD",
            "languages": [
                "hy",
                "ru"
            ],
            "iso3": "ARM"
        },
        "AN": {
            "id": 159,
            "name": "Netherlands Antilles",
            "native": "",
            "phone": "599",
            "continent": "NA",
            "capital": "",
            "currency": "",
            "languages": [],
            "iso3": "ANT"
        },
        "AO": {
            "id": 7,
            "name": "Angola",
            "native": "Angola",
            "phone": "244",
            "continent": "AF",
            "capital": "Luanda",
            "currency": "AOA",
            "languages": [
                "pt"
            ],
            "iso3": "AGO"
        },
        "AQ": {
            "id": 9,
            "name": "Antarctica",
            "native": "Antarctica",
            "phone": "672",
            "continent": "AN",
            "capital": "",
            "currency": "",
            "languages": [],
            "iso3": "ATA"
        },
        "AR": {
            "id": 11,
            "name": "Argentina",
            "native": "Argentina",
            "phone": "54",
            "continent": "SA",
            "capital": "Buenos Aires",
            "currency": "ARS",
            "languages": [
                "es",
                "gn"
            ],
            "iso3": "ARG"
        },
        "AS": {
            "id": 5,
            "name": "American Samoa",
            "native": "American Samoa",
            "phone": "1684",
            "continent": "OC",
            "capital": "Pago Pago",
            "currency": "USD",
            "languages": [
                "en",
                "sm"
            ],
            "iso3": "ASM"
        },
        "AT": {
            "id": 15,
            "name": "Austria",
            "native": "Österreich",
            "phone": "43",
            "continent": "EU",
            "capital": "Vienna",
            "currency": "EUR",
            "languages": [
                "de"
            ],
            "iso3": "AUT"
        },
        "AU": {
            "id": 14,
            "name": "Australia",
            "native": "Australia",
            "phone": "61",
            "continent": "OC",
            "capital": "Canberra",
            "currency": "AUD",
            "languages": [
                "en"
            ],
            "iso3": "AUS"
        },
        "AW": {
            "id": 13,
            "name": "Aruba",
            "native": "Aruba",
            "phone": "297",
            "continent": "NA",
            "capital": "Oranjestad",
            "currency": "AWG",
            "languages": [
                "nl",
                "pa"
            ],
            "iso3": "ABW"
        },
        "AX": {
            "id": 2,
            "name": "Åland",
            "native": "Åland",
            "phone": "358",
            "continent": "EU",
            "capital": "Mariehamn",
            "currency": "EUR",
            "languages": [
                "sv"
            ],
            "iso3": "ALA"
        },
        "AZ": {
            "id": 16,
            "name": "Azerbaijan",
            "native": "Azərbaycan",
            "phone": "994",
            "continent": "AS",
            "capital": "Baku",
            "currency": "AZN",
            "languages": [
                "az"
            ],
            "iso3": "AZE"
        },
        "BA": {
            "id": 29,
            "name": "Bosnia and Herzegovina",
            "native": "Bosna i Hercegovina",
            "phone": "387",
            "continent": "EU",
            "capital": "Sarajevo",
            "currency": "BAM",
            "languages": [
                "bs",
                "hr",
                "sr"
            ],
            "iso3": "BIH"
        },
        "BB": {
            "id": 20,
            "name": "Barbados",
            "native": "Barbados",
            "phone": "1246",
            "continent": "NA",
            "capital": "Bridgetown",
            "currency": "BBD",
            "languages": [
                "en"
            ],
            "iso3": "BRB"
        },
        "BD": {
            "id": 19,
            "name": "Bangladesh",
            "native": "Bangladesh",
            "phone": "880",
            "continent": "AS",
            "capital": "Dhaka",
            "currency": "BDT",
            "languages": [
                "bn"
            ],
            "iso3": "BGD"
        },
        "BE": {
            "id": 22,
            "name": "Belgium",
            "native": "België",
            "phone": "32",
            "continent": "EU",
            "capital": "Brussels",
            "currency": "EUR",
            "languages": [
                "nl",
                "fr",
                "de"
            ],
            "iso3": "BEL"
        },
        "BF": {
            "id": 36,
            "name": "Burkina Faso",
            "native": "Burkina Faso",
            "phone": "226",
            "continent": "AF",
            "capital": "Ouagadougou",
            "currency": "XOF",
            "languages": [
                "fr",
                "ff"
            ],
            "iso3": "BFA"
        },
        "BG": {
            "id": 35,
            "name": "Bulgaria",
            "native": "България",
            "phone": "359",
            "continent": "EU",
            "capital": "Sofia",
            "currency": "BGN",
            "languages": [
                "bg"
            ],
            "iso3": "BGR"
        },
        "BH": {
            "id": 18,
            "name": "Bahrain",
            "native": "‏البحرين",
            "phone": "973",
            "continent": "AS",
            "capital": "Manama",
            "currency": "BHD",
            "languages": [
                "ar"
            ],
            "iso3": "BHR"
        },
        "BI": {
            "id": 37,
            "name": "Burundi",
            "native": "Burundi",
            "phone": "257",
            "continent": "AF",
            "capital": "Bujumbura",
            "currency": "BIF",
            "languages": [
                "fr",
                "rn"
            ],
            "iso3": "BDI"
        },
        "BJ": {
            "id": 24,
            "name": "Benin",
            "native": "Bénin",
            "phone": "229",
            "continent": "AF",
            "capital": "Porto-Novo",
            "currency": "XOF",
            "languages": [
                "fr"
            ],
            "iso3": "BEN"
        },
        "BL": {
            "id": 187,
            "name": "Saint Barthélemy",
            "native": "Saint-Barthélemy",
            "phone": "590",
            "continent": "NA",
            "capital": "Gustavia",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "BLM"
        },
        "BM": {
            "id": 25,
            "name": "Bermuda",
            "native": "Bermuda",
            "phone": "1441",
            "continent": "NA",
            "capital": "Hamilton",
            "currency": "BMD",
            "languages": [
                "en"
            ],
            "iso3": "BMU"
        },
        "BN": {
            "id": 34,
            "name": "Brunei",
            "native": "Negara Brunei Darussalam",
            "phone": "673",
            "continent": "AS",
            "capital": "Bandar Seri Begawan",
            "currency": "BND",
            "languages": [
                "ms"
            ],
            "iso3": "BRN"
        },
        "BO": {
            "id": 27,
            "name": "Bolivia",
            "native": "Bolivia",
            "phone": "591",
            "continent": "SA",
            "capital": "Sucre",
            "currency": "BOB,BOV",
            "languages": [
                "es",
                "ay",
                "qu"
            ],
            "iso3": "BOL"
        },
        "BQ": {
            "id": 28,
            "name": "Bonaire",
            "native": "Bonaire",
            "phone": "5997",
            "continent": "NA",
            "capital": "Kralendijk",
            "currency": "USD",
            "languages": [
                "nl"
            ],
            "iso3": "BES"
        },
        "BR": {
            "id": 32,
            "name": "Brazil",
            "native": "Brasil",
            "phone": "55",
            "continent": "SA",
            "capital": "Brasília",
            "currency": "BRL",
            "languages": [
                "pt"
            ],
            "iso3": "BRA"
        },
        "BS": {
            "id": 17,
            "name": "Bahamas",
            "native": "Bahamas",
            "phone": "1242",
            "continent": "NA",
            "capital": "Nassau",
            "currency": "BSD",
            "languages": [
                "en"
            ],
            "iso3": "BHS"
        },
        "BT": {
            "id": 26,
            "name": "Bhutan",
            "native": "ʼbrug-yul",
            "phone": "975",
            "continent": "AS",
            "capital": "Thimphu",
            "currency": "BTN,INR",
            "languages": [
                "dz"
            ],
            "iso3": "BTN"
        },
        "BV": {
            "id": 31,
            "name": "Bouvet Island",
            "native": "Bouvetøya",
            "phone": "47",
            "continent": "AN",
            "capital": "",
            "currency": "NOK",
            "languages": [
                "no",
                "nb",
                "nn"
            ],
            "iso3": "BVT"
        },
        "BW": {
            "id": 30,
            "name": "Botswana",
            "native": "Botswana",
            "phone": "267",
            "continent": "AF",
            "capital": "Gaborone",
            "currency": "BWP",
            "languages": [
                "en",
                "tn"
            ],
            "iso3": "BWA"
        },
        "BY": {
            "id": 21,
            "name": "Belarus",
            "native": "Белару́сь",
            "phone": "375",
            "continent": "EU",
            "capital": "Minsk",
            "currency": "BYN",
            "languages": [
                "be",
                "ru"
            ],
            "iso3": "BLR"
        },
        "BZ": {
            "id": 23,
            "name": "Belize",
            "native": "Belize",
            "phone": "501",
            "continent": "NA",
            "capital": "Belmopan",
            "currency": "BZD",
            "languages": [
                "en",
                "es"
            ],
            "iso3": "BLZ"
        },
        "CA": {
            "id": 40,
            "name": "Canada",
            "native": "Canada",
            "phone": "1",
            "continent": "NA",
            "capital": "Ottawa",
            "currency": "CAD",
            "languages": [
                "en",
                "fr"
            ],
            "iso3": "CAN"
        },
        "CC": {
            "id": 48,
            "name": "Cocos [Keeling] Islands",
            "native": "Cocos (Keeling) Islands",
            "phone": "61",
            "continent": "AS",
            "capital": "West Island",
            "currency": "AUD",
            "languages": [
                "en"
            ],
            "iso3": "CCK"
        },
        "CD": {
            "id": 52,
            "name": "Democratic Republic of the Congo",
            "native": "République démocratique du Congo",
            "phone": "243",
            "continent": "AF",
            "capital": "Kinshasa",
            "currency": "CDF",
            "languages": [
                "fr",
                "ln",
                "kg",
                "sw",
                "lu"
            ],
            "iso3": "COD"
        },
        "CF": {
            "id": 43,
            "name": "Central African Republic",
            "native": "Ködörösêse tî Bêafrîka",
            "phone": "236",
            "continent": "AF",
            "capital": "Bangui",
            "currency": "XAF",
            "languages": [
                "fr",
                "sg"
            ],
            "iso3": "CAF"
        },
        "CG": {
            "id": 51,
            "name": "Republic of the Congo",
            "native": "République du Congo",
            "phone": "242",
            "continent": "AF",
            "capital": "Brazzaville",
            "currency": "XAF",
            "languages": [
                "fr",
                "ln"
            ],
            "iso3": "COG"
        },
        "CH": {
            "id": 219,
            "name": "Switzerland",
            "native": "Schweiz",
            "phone": "41",
            "continent": "EU",
            "capital": "Bern",
            "currency": "CHE,CHF,CHW",
            "languages": [
                "de",
                "fr",
                "it"
            ],
            "iso3": "CHE"
        },
        "CI": {
            "id": 55,
            "name": "Ivory Coast",
            "native": "Côte d'Ivoire",
            "phone": "225",
            "continent": "AF",
            "capital": "Yamoussoukro",
            "currency": "XOF",
            "languages": [
                "fr"
            ],
            "iso3": "CIV"
        },
        "CK": {
            "id": 53,
            "name": "Cook Islands",
            "native": "Cook Islands",
            "phone": "682",
            "continent": "OC",
            "capital": "Avarua",
            "currency": "NZD",
            "languages": [
                "en"
            ],
            "iso3": "COK"
        },
        "CL": {
            "id": 45,
            "name": "Chile",
            "native": "Chile",
            "phone": "56",
            "continent": "SA",
            "capital": "Santiago",
            "currency": "CLF,CLP",
            "languages": [
                "es"
            ],
            "iso3": "CHL"
        },
        "CM": {
            "id": 39,
            "name": "Cameroon",
            "native": "Cameroon",
            "phone": "237",
            "continent": "AF",
            "capital": "Yaoundé",
            "currency": "XAF",
            "languages": [
                "en",
                "fr"
            ],
            "iso3": "CMR"
        },
        "CN": {
            "id": 46,
            "name": "China",
            "native": "中国",
            "phone": "86",
            "continent": "AS",
            "capital": "Beijing",
            "currency": "CNY",
            "languages": [
                "zh"
            ],
            "iso3": "CHN"
        },
        "CO": {
            "id": 49,
            "name": "Colombia",
            "native": "Colombia",
            "phone": "57",
            "continent": "SA",
            "capital": "Bogotá",
            "currency": "COP",
            "languages": [
                "es"
            ],
            "iso3": "COL"
        },
        "CR": {
            "id": 54,
            "name": "Costa Rica",
            "native": "Costa Rica",
            "phone": "506",
            "continent": "NA",
            "capital": "San José",
            "currency": "CRC",
            "languages": [
                "es"
            ],
            "iso3": "CRI"
        },
        "CS": {
            "id": 200,
            "name": "Serbia and Montenegro",
            "native": "",
            "phone": "381",
            "continent": "EU",
            "capital": "",
            "currency": "",
            "languages": [],
            "iso3": "SCG"
        },
        "CU": {
            "id": 57,
            "name": "Cuba",
            "native": "Cuba",
            "phone": "53",
            "continent": "NA",
            "capital": "Havana",
            "currency": "CUC,CUP",
            "languages": [
                "es"
            ],
            "iso3": "CUB"
        },
        "CV": {
            "id": 41,
            "name": "Cape Verde",
            "native": "Cabo Verde",
            "phone": "238",
            "continent": "AF",
            "capital": "Praia",
            "currency": "CVE",
            "languages": [
                "pt"
            ],
            "iso3": "CPV"
        },
        "CW": {
            "id": 58,
            "name": "Curacao",
            "native": "Curaçao",
            "phone": "5999",
            "continent": "NA",
            "capital": "Willemstad",
            "currency": "ANG",
            "languages": [
                "nl",
                "pa",
                "en"
            ],
            "iso3": "CUW"
        },
        "CX": {
            "id": 47,
            "name": "Christmas Island",
            "native": "Christmas Island",
            "phone": "61",
            "continent": "AS",
            "capital": "Flying Fish Cove",
            "currency": "AUD",
            "languages": [
                "en"
            ],
            "iso3": "CXR"
        },
        "CY": {
            "id": 59,
            "name": "Cyprus",
            "native": "Κύπρος",
            "phone": "357",
            "continent": "EU",
            "capital": "Nicosia",
            "currency": "EUR",
            "languages": [
                "el",
                "tr",
                "hy"
            ],
            "iso3": "CYP"
        },
        "CZ": {
            "id": 60,
            "name": "Czech Republic",
            "native": "Česká republika",
            "phone": "420",
            "continent": "EU",
            "capital": "Prague",
            "currency": "CZK",
            "languages": [
                "cs",
                "sk"
            ],
            "iso3": "CZE"
        },
        "DE": {
            "id": 83,
            "name": "Germany",
            "native": "Deutschland",
            "phone": "49",
            "continent": "EU",
            "capital": "Berlin",
            "currency": "EUR",
            "languages": [
                "de"
            ],
            "iso3": "DEU"
        },
        "DJ": {
            "id": 62,
            "name": "Djibouti",
            "native": "Djibouti",
            "phone": "253",
            "continent": "AF",
            "capital": "Djibouti",
            "currency": "DJF",
            "languages": [
                "fr",
                "ar"
            ],
            "iso3": "DJI"
        },
        "DK": {
            "id": 61,
            "name": "Denmark",
            "native": "Danmark",
            "phone": "45",
            "continent": "EU",
            "capital": "Copenhagen",
            "currency": "DKK",
            "languages": [
                "da"
            ],
            "iso3": "DNK"
        },
        "DM": {
            "id": 63,
            "name": "Dominica",
            "native": "Dominica",
            "phone": "1767",
            "continent": "NA",
            "capital": "Roseau",
            "currency": "XCD",
            "languages": [
                "en"
            ],
            "iso3": "DMA"
        },
        "DO": {
            "id": 64,
            "name": "Dominican Republic",
            "native": "República Dominicana",
            "phone": "1809,1829,1849",
            "continent": "NA",
            "capital": "Santo Domingo",
            "currency": "DOP",
            "languages": [
                "es"
            ],
            "iso3": "DOM"
        },
        "DZ": {
            "id": 4,
            "name": "Algeria",
            "native": "الجزائر",
            "phone": "213",
            "continent": "AF",
            "capital": "Algiers",
            "currency": "DZD",
            "languages": [
                "ar"
            ],
            "iso3": "DZA"
        },
        "EC": {
            "id": 65,
            "name": "Ecuador",
            "native": "Ecuador",
            "phone": "593",
            "continent": "SA",
            "capital": "Quito",
            "currency": "USD",
            "languages": [
                "es"
            ],
            "iso3": "ECU"
        },
        "EE": {
            "id": 70,
            "name": "Estonia",
            "native": "Eesti",
            "phone": "372",
            "continent": "EU",
            "capital": "Tallinn",
            "currency": "EUR",
            "languages": [
                "et"
            ],
            "iso3": "EST"
        },
        "EG": {
            "id": 66,
            "name": "Egypt",
            "native": "مصر‎",
            "phone": "20",
            "continent": "AF",
            "capital": "Cairo",
            "currency": "EGP",
            "languages": [
                "ar"
            ],
            "iso3": "EGY"
        },
        "EH": {
            "id": 249,
            "name": "Western Sahara",
            "native": "الصحراء الغربية",
            "phone": "212",
            "continent": "AF",
            "capital": "El Aaiún",
            "currency": "MAD,DZD,MRU",
            "languages": [
                "es"
            ],
            "iso3": "ESH"
        },
        "ER": {
            "id": 69,
            "name": "Eritrea",
            "native": "ኤርትራ",
            "phone": "291",
            "continent": "AF",
            "capital": "Asmara",
            "currency": "ERN",
            "languages": [
                "ti",
                "ar",
                "en"
            ],
            "iso3": "ERI"
        },
        "ES": {
            "id": 212,
            "name": "Spain",
            "native": "España",
            "phone": "34",
            "continent": "EU",
            "capital": "Madrid",
            "currency": "EUR",
            "languages": [
                "es",
                "eu",
                "ca",
                "gl",
                "oc"
            ],
            "iso3": "ESP"
        },
        "ET": {
            "id": 71,
            "name": "Ethiopia",
            "native": "ኢትዮጵያ",
            "phone": "251",
            "continent": "AF",
            "capital": "Addis Ababa",
            "currency": "ETB",
            "languages": [
                "am"
            ],
            "iso3": "ETH"
        },
        "FI": {
            "id": 75,
            "name": "Finland",
            "native": "Suomi",
            "phone": "358",
            "continent": "EU",
            "capital": "Helsinki",
            "currency": "EUR",
            "languages": [
                "fi",
                "sv"
            ],
            "iso3": "FIN"
        },
        "FJ": {
            "id": 74,
            "name": "Fiji",
            "native": "Fiji",
            "phone": "679",
            "continent": "OC",
            "capital": "Suva",
            "currency": "FJD",
            "languages": [
                "en",
                "fj",
                "hi",
                "ur"
            ],
            "iso3": "FJI"
        },
        "FK": {
            "id": 72,
            "name": "Falkland Islands",
            "native": "Falkland Islands",
            "phone": "500",
            "continent": "SA",
            "capital": "Stanley",
            "currency": "FKP",
            "languages": [
                "en"
            ],
            "iso3": "FLK"
        },
        "FM": {
            "id": 146,
            "name": "Micronesia",
            "native": "Micronesia",
            "phone": "691",
            "continent": "OC",
            "capital": "Palikir",
            "currency": "USD",
            "languages": [
                "en"
            ],
            "iso3": "FSM"
        },
        "FO": {
            "id": 73,
            "name": "Faroe Islands",
            "native": "Føroyar",
            "phone": "298",
            "continent": "EU",
            "capital": "Tórshavn",
            "currency": "DKK",
            "languages": [
                "fo"
            ],
            "iso3": "FRO"
        },
        "FR": {
            "id": 76,
            "name": "France",
            "native": "France",
            "phone": "33",
            "continent": "EU",
            "capital": "Paris",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "FRA"
        },
        "GA": {
            "id": 80,
            "name": "Gabon",
            "native": "Gabon",
            "phone": "241",
            "continent": "AF",
            "capital": "Libreville",
            "currency": "XAF",
            "languages": [
                "fr"
            ],
            "iso3": "GAB"
        },
        "GB": {
            "id": 238,
            "name": "United Kingdom",
            "native": "United Kingdom",
            "phone": "44",
            "continent": "EU",
            "capital": "London",
            "currency": "GBP",
            "languages": [
                "en"
            ],
            "iso3": "GBR"
        },
        "GD": {
            "id": 88,
            "name": "Grenada",
            "native": "Grenada",
            "phone": "1473",
            "continent": "NA",
            "capital": "St. George's",
            "currency": "XCD",
            "languages": [
                "en"
            ],
            "iso3": "GRD"
        },
        "GE": {
            "id": 82,
            "name": "Georgia",
            "native": "საქართველო",
            "phone": "995",
            "continent": "AS",
            "capital": "Tbilisi",
            "currency": "GEL",
            "languages": [
                "ka"
            ],
            "iso3": "GEO"
        },
        "GF": {
            "id": 77,
            "name": "French Guiana",
            "native": "Guyane française",
            "phone": "594",
            "continent": "SA",
            "capital": "Cayenne",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "GUF"
        },
        "GG": {
            "id": 92,
            "name": "Guernsey",
            "native": "Guernsey",
            "phone": "44",
            "continent": "EU",
            "capital": "St. Peter Port",
            "currency": "GBP",
            "languages": [
                "en",
                "fr"
            ],
            "iso3": "GGY"
        },
        "GH": {
            "id": 84,
            "name": "Ghana",
            "native": "Ghana",
            "phone": "233",
            "continent": "AF",
            "capital": "Accra",
            "currency": "GHS",
            "languages": [
                "en"
            ],
            "iso3": "GHA"
        },
        "GI": {
            "id": 85,
            "name": "Gibraltar",
            "native": "Gibraltar",
            "phone": "350",
            "continent": "EU",
            "capital": "Gibraltar",
            "currency": "GIP",
            "languages": [
                "en"
            ],
            "iso3": "GIB"
        },
        "GL": {
            "id": 87,
            "name": "Greenland",
            "native": "Kalaallit Nunaat",
            "phone": "299",
            "continent": "NA",
            "capital": "Nuuk",
            "currency": "DKK",
            "languages": [
                "kl"
            ],
            "iso3": "GRL"
        },
        "GM": {
            "id": 81,
            "name": "Gambia",
            "native": "Gambia",
            "phone": "220",
            "continent": "AF",
            "capital": "Banjul",
            "currency": "GMD",
            "languages": [
                "en"
            ],
            "iso3": "GMB"
        },
        "GN": {
            "id": 93,
            "name": "Guinea",
            "native": "Guinée",
            "phone": "224",
            "continent": "AF",
            "capital": "Conakry",
            "currency": "GNF",
            "languages": [
                "fr",
                "ff"
            ],
            "iso3": "GIN"
        },
        "GP": {
            "id": 89,
            "name": "Guadeloupe",
            "native": "Guadeloupe",
            "phone": "590",
            "continent": "NA",
            "capital": "Basse-Terre",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "GLP"
        },
        "GQ": {
            "id": 68,
            "name": "Equatorial Guinea",
            "native": "Guinea Ecuatorial",
            "phone": "240",
            "continent": "AF",
            "capital": "Malabo",
            "currency": "XAF",
            "languages": [
                "es",
                "fr"
            ],
            "iso3": "GNQ"
        },
        "GR": {
            "id": 86,
            "name": "Greece",
            "native": "Ελλάδα",
            "phone": "30",
            "continent": "EU",
            "capital": "Athens",
            "currency": "EUR",
            "languages": [
                "el"
            ],
            "iso3": "GRC"
        },
        "GS": {
            "id": 210,
            "name": "South Georgia and the South Sandwich Islands",
            "native": "South Georgia",
            "phone": "500",
            "continent": "AN",
            "capital": "King Edward Point",
            "currency": "GBP",
            "languages": [
                "en"
            ],
            "iso3": "SGS"
        },
        "GT": {
            "id": 91,
            "name": "Guatemala",
            "native": "Guatemala",
            "phone": "502",
            "continent": "NA",
            "capital": "Guatemala City",
            "currency": "GTQ",
            "languages": [
                "es"
            ],
            "iso3": "GTM"
        },
        "GU": {
            "id": 90,
            "name": "Guam",
            "native": "Guam",
            "phone": "1671",
            "continent": "OC",
            "capital": "Hagåtña",
            "currency": "USD",
            "languages": [
                "en",
                "ch",
                "es"
            ],
            "iso3": "GUM"
        },
        "GW": {
            "id": 94,
            "name": "Guinea-Bissau",
            "native": "Guiné-Bissau",
            "phone": "245",
            "continent": "AF",
            "capital": "Bissau",
            "currency": "XOF",
            "languages": [
                "pt"
            ],
            "iso3": "GNB"
        },
        "GY": {
            "id": 95,
            "name": "Guyana",
            "native": "Guyana",
            "phone": "592",
            "continent": "SA",
            "capital": "Georgetown",
            "currency": "GYD",
            "languages": [
                "en"
            ],
            "iso3": "GUY"
        },
        "HK": {
            "id": 100,
            "name": "Hong Kong",
            "native": "香港",
            "phone": "852",
            "continent": "AS",
            "capital": "City of Victoria",
            "currency": "HKD",
            "languages": [
                "zh",
                "en"
            ],
            "iso3": "HKG"
        },
        "HM": {
            "id": 97,
            "name": "Heard Island and McDonald Islands",
            "native": "Heard Island and McDonald Islands",
            "phone": "61",
            "continent": "AN",
            "capital": "",
            "currency": "AUD",
            "languages": [
                "en"
            ],
            "iso3": "HMD"
        },
        "HN": {
            "id": 99,
            "name": "Honduras",
            "native": "Honduras",
            "phone": "504",
            "continent": "NA",
            "capital": "Tegucigalpa",
            "currency": "HNL",
            "languages": [
                "es"
            ],
            "iso3": "HND"
        },
        "HR": {
            "id": 56,
            "name": "Croatia",
            "native": "Hrvatska",
            "phone": "385",
            "continent": "EU",
            "capital": "Zagreb",
            "currency": "HRK",
            "languages": [
                "hr"
            ],
            "iso3": "HRV"
        },
        "HT": {
            "id": 96,
            "name": "Haiti",
            "native": "Haïti",
            "phone": "509",
            "continent": "NA",
            "capital": "Port-au-Prince",
            "currency": "HTG,USD",
            "languages": [
                "fr",
                "ht"
            ],
            "iso3": "HTI"
        },
        "HU": {
            "id": 101,
            "name": "Hungary",
            "native": "Magyarország",
            "phone": "36",
            "continent": "EU",
            "capital": "Budapest",
            "currency": "HUF",
            "languages": [
                "hu"
            ],
            "iso3": "HUN"
        },
        "ID": {
            "id": 104,
            "name": "Indonesia",
            "native": "Indonesia",
            "phone": "62",
            "continent": "AS",
            "capital": "Jakarta",
            "currency": "IDR",
            "languages": [
                "id"
            ],
            "iso3": "IDN"
        },
        "IE": {
            "id": 107,
            "name": "Ireland",
            "native": "Éire",
            "phone": "353",
            "continent": "EU",
            "capital": "Dublin",
            "currency": "EUR",
            "languages": [
                "ga",
                "en"
            ],
            "iso3": "IRL"
        },
        "IL": {
            "id": 109,
            "name": "Israel",
            "native": "יִשְׂרָאֵל",
            "phone": "972",
            "continent": "AS",
            "capital": "Jerusalem",
            "currency": "ILS",
            "languages": [
                "he",
                "ar"
            ],
            "iso3": "ISR"
        },
        "IM": {
            "id": 108,
            "name": "Isle of Man",
            "native": "Isle of Man",
            "phone": "44",
            "continent": "EU",
            "capital": "Douglas",
            "currency": "GBP",
            "languages": [
                "en",
                "gv"
            ],
            "iso3": "IMN"
        },
        "IN": {
            "id": 103,
            "name": "India",
            "native": "भारत",
            "phone": "91",
            "continent": "AS",
            "capital": "New Delhi",
            "currency": "INR",
            "languages": [
                "hi",
                "en"
            ],
            "iso3": "IND"
        },
        "IO": {
            "id": 33,
            "name": "British Indian Ocean Territory",
            "native": "British Indian Ocean Territory",
            "phone": "246",
            "continent": "AS",
            "capital": "Diego Garcia",
            "currency": "USD",
            "languages": [
                "en"
            ],
            "iso3": "IOT"
        },
        "IQ": {
            "id": 106,
            "name": "Iraq",
            "native": "العراق",
            "phone": "964",
            "continent": "AS",
            "capital": "Baghdad",
            "currency": "IQD",
            "languages": [
                "ar",
                "ku"
            ],
            "iso3": "IRQ"
        },
        "IR": {
            "id": 105,
            "name": "Iran",
            "native": "ایران",
            "phone": "98",
            "continent": "AS",
            "capital": "Tehran",
            "currency": "IRR",
            "languages": [
                "fa"
            ],
            "iso3": "IRN"
        },
        "IS": {
            "id": 102,
            "name": "Iceland",
            "native": "Ísland",
            "phone": "354",
            "continent": "EU",
            "capital": "Reykjavik",
            "currency": "ISK",
            "languages": [
                "is"
            ],
            "iso3": "ISL"
        },
        "IT": {
            "id": 110,
            "name": "Italy",
            "native": "Italia",
            "phone": "39",
            "continent": "EU",
            "capital": "Rome",
            "currency": "EUR",
            "languages": [
                "it"
            ],
            "iso3": "ITA"
        },
        "JE": {
            "id": 113,
            "name": "Jersey",
            "native": "Jersey",
            "phone": "44",
            "continent": "EU",
            "capital": "Saint Helier",
            "currency": "GBP",
            "languages": [
                "en",
                "fr"
            ],
            "iso3": "JEY"
        },
        "JM": {
            "id": 111,
            "name": "Jamaica",
            "native": "Jamaica",
            "phone": "1876",
            "continent": "NA",
            "capital": "Kingston",
            "currency": "JMD",
            "languages": [
                "en"
            ],
            "iso3": "JAM"
        },
        "JO": {
            "id": 114,
            "name": "Jordan",
            "native": "الأردن",
            "phone": "962",
            "continent": "AS",
            "capital": "Amman",
            "currency": "JOD",
            "languages": [
                "ar"
            ],
            "iso3": "JOR"
        },
        "JP": {
            "id": 112,
            "name": "Japan",
            "native": "日本",
            "phone": "81",
            "continent": "AS",
            "capital": "Tokyo",
            "currency": "JPY",
            "languages": [
                "ja"
            ],
            "iso3": "JPN"
        },
        "KE": {
            "id": 116,
            "name": "Kenya",
            "native": "Kenya",
            "phone": "254",
            "continent": "AF",
            "capital": "Nairobi",
            "currency": "KES",
            "languages": [
                "en",
                "sw"
            ],
            "iso3": "KEN"
        },
        "KG": {
            "id": 122,
            "name": "Kyrgyzstan",
            "native": "Кыргызстан",
            "phone": "996",
            "continent": "AS",
            "capital": "Bishkek",
            "currency": "KGS",
            "languages": [
                "ky",
                "ru"
            ],
            "iso3": "KGZ"
        },
        "KH": {
            "id": 38,
            "name": "Cambodia",
            "native": "Kâmpŭchéa",
            "phone": "855",
            "continent": "AS",
            "capital": "Phnom Penh",
            "currency": "KHR",
            "languages": [
                "km"
            ],
            "iso3": "KHM"
        },
        "KI": {
            "id": 117,
            "name": "Kiribati",
            "native": "Kiribati",
            "phone": "686",
            "continent": "OC",
            "capital": "South Tarawa",
            "currency": "AUD",
            "languages": [
                "en"
            ],
            "iso3": "KIR"
        },
        "KM": {
            "id": 50,
            "name": "Comoros",
            "native": "Komori",
            "phone": "269",
            "continent": "AF",
            "capital": "Moroni",
            "currency": "KMF",
            "languages": [
                "ar",
                "fr"
            ],
            "iso3": "COM"
        },
        "KN": {
            "id": 189,
            "name": "Saint Kitts and Nevis",
            "native": "Saint Kitts and Nevis",
            "phone": "1869",
            "continent": "NA",
            "capital": "Basseterre",
            "currency": "XCD",
            "languages": [
                "en"
            ],
            "iso3": "KNA"
        },
        "KP": {
            "id": 118,
            "name": "North Korea",
            "native": "북한",
            "phone": "850",
            "continent": "AS",
            "capital": "Pyongyang",
            "currency": "KPW",
            "languages": [
                "ko"
            ],
            "iso3": "PRK"
        },
        "KR": {
            "id": 119,
            "name": "South Korea",
            "native": "대한민국",
            "phone": "82",
            "continent": "AS",
            "capital": "Seoul",
            "currency": "KRW",
            "languages": [
                "ko"
            ],
            "iso3": "KOR"
        },
        "KW": {
            "id": 121,
            "name": "Kuwait",
            "native": "الكويت",
            "phone": "965",
            "continent": "AS",
            "capital": "Kuwait City",
            "currency": "KWD",
            "languages": [
                "ar"
            ],
            "iso3": "KWT"
        },
        "KY": {
            "id": 42,
            "name": "Cayman Islands",
            "native": "Cayman Islands",
            "phone": "1345",
            "continent": "NA",
            "capital": "George Town",
            "currency": "KYD",
            "languages": [
                "en"
            ],
            "iso3": "CYM"
        },
        "KZ": {
            "id": 115,
            "name": "Kazakhstan",
            "native": "Қазақстан",
            "phone": "76,77",
            "continent": "AS",
            "capital": "Astana",
            "currency": "KZT",
            "languages": [
                "kk",
                "ru"
            ],
            "iso3": "KAZ"
        },
        "LA": {
            "id": 123,
            "name": "Laos",
            "native": "ສປປລາວ",
            "phone": "856",
            "continent": "AS",
            "capital": "Vientiane",
            "currency": "LAK",
            "languages": [
                "lo"
            ],
            "iso3": "LAO"
        },
        "LB": {
            "id": 125,
            "name": "Lebanon",
            "native": "لبنان",
            "phone": "961",
            "continent": "AS",
            "capital": "Beirut",
            "currency": "LBP",
            "languages": [
                "ar",
                "fr"
            ],
            "iso3": "LBN"
        },
        "LC": {
            "id": 190,
            "name": "Saint Lucia",
            "native": "Saint Lucia",
            "phone": "1758",
            "continent": "NA",
            "capital": "Castries",
            "currency": "XCD",
            "languages": [
                "en"
            ],
            "iso3": "LCA"
        },
        "LI": {
            "id": 129,
            "name": "Liechtenstein",
            "native": "Liechtenstein",
            "phone": "423",
            "continent": "EU",
            "capital": "Vaduz",
            "currency": "CHF",
            "languages": [
                "de"
            ],
            "iso3": "LIE"
        },
        "LK": {
            "id": 213,
            "name": "Sri Lanka",
            "native": "śrī laṃkāva",
            "phone": "94",
            "continent": "AS",
            "capital": "Colombo",
            "currency": "LKR",
            "languages": [
                "si",
                "ta"
            ],
            "iso3": "LKA"
        },
        "LR": {
            "id": 127,
            "name": "Liberia",
            "native": "Liberia",
            "phone": "231",
            "continent": "AF",
            "capital": "Monrovia",
            "currency": "LRD",
            "languages": [
                "en"
            ],
            "iso3": "LBR"
        },
        "LS": {
            "id": 126,
            "name": "Lesotho",
            "native": "Lesotho",
            "phone": "266",
            "continent": "AF",
            "capital": "Maseru",
            "currency": "LSL,ZAR",
            "languages": [
                "en",
                "st"
            ],
            "iso3": "LSO"
        },
        "LT": {
            "id": 130,
            "name": "Lithuania",
            "native": "Lietuva",
            "phone": "370",
            "continent": "EU",
            "capital": "Vilnius",
            "currency": "EUR",
            "languages": [
                "lt"
            ],
            "iso3": "LTU"
        },
        "LU": {
            "id": 131,
            "name": "Luxembourg",
            "native": "Luxembourg",
            "phone": "352",
            "continent": "EU",
            "capital": "Luxembourg",
            "currency": "EUR",
            "languages": [
                "fr",
                "de",
                "lb"
            ],
            "iso3": "LUX"
        },
        "LV": {
            "id": 124,
            "name": "Latvia",
            "native": "Latvija",
            "phone": "371",
            "continent": "EU",
            "capital": "Riga",
            "currency": "EUR",
            "languages": [
                "lv"
            ],
            "iso3": "LVA"
        },
        "LY": {
            "id": 128,
            "name": "Libya",
            "native": "‏ليبيا",
            "phone": "218",
            "continent": "AF",
            "capital": "Tripoli",
            "currency": "LYD",
            "languages": [
                "ar"
            ],
            "iso3": "LBY"
        },
        "MA": {
            "id": 152,
            "name": "Morocco",
            "native": "المغرب",
            "phone": "212",
            "continent": "AF",
            "capital": "Rabat",
            "currency": "MAD",
            "languages": [
                "ar"
            ],
            "iso3": "MAR"
        },
        "MC": {
            "id": 148,
            "name": "Monaco",
            "native": "Monaco",
            "phone": "377",
            "continent": "EU",
            "capital": "Monaco",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "MCO"
        },
        "MD": {
            "id": 147,
            "name": "Moldova",
            "native": "Moldova",
            "phone": "373",
            "continent": "EU",
            "capital": "Chișinău",
            "currency": "MDL",
            "languages": [
                "ro"
            ],
            "iso3": "MDA"
        },
        "ME": {
            "id": 150,
            "name": "Montenegro",
            "native": "Црна Гора",
            "phone": "382",
            "continent": "EU",
            "capital": "Podgorica",
            "currency": "EUR",
            "languages": [
                "sr",
                "bs",
                "sq",
                "hr"
            ],
            "iso3": "MNE"
        },
        "MF": {
            "id": 191,
            "name": "Saint Martin",
            "native": "Saint-Martin",
            "phone": "590",
            "continent": "NA",
            "capital": "Marigot",
            "currency": "EUR",
            "languages": [
                "en",
                "fr",
                "nl"
            ],
            "iso3": "MAF"
        },
        "MG": {
            "id": 134,
            "name": "Madagascar",
            "native": "Madagasikara",
            "phone": "261",
            "continent": "AF",
            "capital": "Antananarivo",
            "currency": "MGA",
            "languages": [
                "fr",
                "mg"
            ],
            "iso3": "MDG"
        },
        "MH": {
            "id": 140,
            "name": "Marshall Islands",
            "native": "M̧ajeļ",
            "phone": "692",
            "continent": "OC",
            "capital": "Majuro",
            "currency": "USD",
            "languages": [
                "en",
                "mh"
            ],
            "iso3": "MHL"
        },
        "MK": {
            "id": 133,
            "name": "North Macedonia",
            "native": "Северна Македонија",
            "phone": "389",
            "continent": "EU",
            "capital": "Skopje",
            "currency": "MKD",
            "languages": [
                "mk"
            ],
            "iso3": "MKD"
        },
        "ML": {
            "id": 138,
            "name": "Mali",
            "native": "Mali",
            "phone": "223",
            "continent": "AF",
            "capital": "Bamako",
            "currency": "XOF",
            "languages": [
                "fr"
            ],
            "iso3": "MLI"
        },
        "MM": {
            "id": 154,
            "name": "Myanmar [Burma]",
            "native": "မြန်မာ",
            "phone": "95",
            "continent": "AS",
            "capital": "Naypyidaw",
            "currency": "MMK",
            "languages": [
                "my"
            ],
            "iso3": "MMR"
        },
        "MN": {
            "id": 149,
            "name": "Mongolia",
            "native": "Монгол улс",
            "phone": "976",
            "continent": "AS",
            "capital": "Ulan Bator",
            "currency": "MNT",
            "languages": [
                "mn"
            ],
            "iso3": "MNG"
        },
        "MO": {
            "id": 132,
            "name": "Macao",
            "native": "澳門",
            "phone": "853",
            "continent": "AS",
            "capital": "",
            "currency": "MOP",
            "languages": [
                "zh",
                "pt"
            ],
            "iso3": "MAC"
        },
        "MP": {
            "id": 167,
            "name": "Northern Mariana Islands",
            "native": "Northern Mariana Islands",
            "phone": "1670",
            "continent": "OC",
            "capital": "Saipan",
            "currency": "USD",
            "languages": [
                "en",
                "ch"
            ],
            "iso3": "MNP"
        },
        "MQ": {
            "id": 141,
            "name": "Martinique",
            "native": "Martinique",
            "phone": "596",
            "continent": "NA",
            "capital": "Fort-de-France",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "MTQ"
        },
        "MR": {
            "id": 142,
            "name": "Mauritania",
            "native": "موريتانيا",
            "phone": "222",
            "continent": "AF",
            "capital": "Nouakchott",
            "currency": "MRU",
            "languages": [
                "ar"
            ],
            "iso3": "MRT"
        },
        "MS": {
            "id": 151,
            "name": "Montserrat",
            "native": "Montserrat",
            "phone": "1664",
            "continent": "NA",
            "capital": "Plymouth",
            "currency": "XCD",
            "languages": [
                "en"
            ],
            "iso3": "MSR"
        },
        "MT": {
            "id": 139,
            "name": "Malta",
            "native": "Malta",
            "phone": "356",
            "continent": "EU",
            "capital": "Valletta",
            "currency": "EUR",
            "languages": [
                "mt",
                "en"
            ],
            "iso3": "MLT"
        },
        "MU": {
            "id": 143,
            "name": "Mauritius",
            "native": "Maurice",
            "phone": "230",
            "continent": "AF",
            "capital": "Port Louis",
            "currency": "MUR",
            "languages": [
                "en"
            ],
            "iso3": "MUS"
        },
        "MV": {
            "id": 137,
            "name": "Maldives",
            "native": "Maldives",
            "phone": "960",
            "continent": "AS",
            "capital": "Malé",
            "currency": "MVR",
            "languages": [
                "dv"
            ],
            "iso3": "MDV"
        },
        "MW": {
            "id": 135,
            "name": "Malawi",
            "native": "Malawi",
            "phone": "265",
            "continent": "AF",
            "capital": "Lilongwe",
            "currency": "MWK",
            "languages": [
                "en",
                "ny"
            ],
            "iso3": "MWI"
        },
        "MX": {
            "id": 145,
            "name": "Mexico",
            "native": "México",
            "phone": "52",
            "continent": "NA",
            "capital": "Mexico City",
            "currency": "MXN",
            "languages": [
                "es"
            ],
            "iso3": "MEX"
        },
        "MY": {
            "id": 136,
            "name": "Malaysia",
            "native": "Malaysia",
            "phone": "60",
            "continent": "AS",
            "capital": "Kuala Lumpur",
            "currency": "MYR",
            "languages": [
                "ms"
            ],
            "iso3": "MYS"
        },
        "MZ": {
            "id": 153,
            "name": "Mozambique",
            "native": "Moçambique",
            "phone": "258",
            "continent": "AF",
            "capital": "Maputo",
            "currency": "MZN",
            "languages": [
                "pt"
            ],
            "iso3": "MOZ"
        },
        "NA": {
            "id": 155,
            "name": "Namibia",
            "native": "Namibia",
            "phone": "264",
            "continent": "AF",
            "capital": "Windhoek",
            "currency": "NAD,ZAR",
            "languages": [
                "en",
                "af"
            ],
            "iso3": "NAM"
        },
        "NC": {
            "id": 160,
            "name": "New Caledonia",
            "native": "Nouvelle-Calédonie",
            "phone": "687",
            "continent": "OC",
            "capital": "Nouméa",
            "currency": "XPF",
            "languages": [
                "fr"
            ],
            "iso3": "NCL"
        },
        "NE": {
            "id": 163,
            "name": "Niger",
            "native": "Niger",
            "phone": "227",
            "continent": "AF",
            "capital": "Niamey",
            "currency": "XOF",
            "languages": [
                "fr"
            ],
            "iso3": "NER"
        },
        "NF": {
            "id": 166,
            "name": "Norfolk Island",
            "native": "Norfolk Island",
            "phone": "672",
            "continent": "OC",
            "capital": "Kingston",
            "currency": "AUD",
            "languages": [
                "en"
            ],
            "iso3": "NFK"
        },
        "NG": {
            "id": 164,
            "name": "Nigeria",
            "native": "Nigeria",
            "phone": "234",
            "continent": "AF",
            "capital": "Abuja",
            "currency": "NGN",
            "languages": [
                "en"
            ],
            "iso3": "NGA"
        },
        "NI": {
            "id": 162,
            "name": "Nicaragua",
            "native": "Nicaragua",
            "phone": "505",
            "continent": "NA",
            "capital": "Managua",
            "currency": "NIO",
            "languages": [
                "es"
            ],
            "iso3": "NIC"
        },
        "NL": {
            "id": 158,
            "name": "Netherlands",
            "native": "Nederland",
            "phone": "31",
            "continent": "EU",
            "capital": "Amsterdam",
            "currency": "EUR",
            "languages": [
                "nl"
            ],
            "iso3": "NLD"
        },
        "NO": {
            "id": 168,
            "name": "Norway",
            "native": "Norge",
            "phone": "47",
            "continent": "EU",
            "capital": "Oslo",
            "currency": "NOK",
            "languages": [
                "no",
                "nb",
                "nn"
            ],
            "iso3": "NOR"
        },
        "NP": {
            "id": 157,
            "name": "Nepal",
            "native": "नपल",
            "phone": "977",
            "continent": "AS",
            "capital": "Kathmandu",
            "currency": "NPR",
            "languages": [
                "ne"
            ],
            "iso3": "NPL"
        },
        "NR": {
            "id": 156,
            "name": "Nauru",
            "native": "Nauru",
            "phone": "674",
            "continent": "OC",
            "capital": "Yaren",
            "currency": "AUD",
            "languages": [
                "en",
                "na"
            ],
            "iso3": "NRU"
        },
        "NU": {
            "id": 165,
            "name": "Niue",
            "native": "Niuē",
            "phone": "683",
            "continent": "OC",
            "capital": "Alofi",
            "currency": "NZD",
            "languages": [
                "en"
            ],
            "iso3": "NIU"
        },
        "NZ": {
            "id": 161,
            "name": "New Zealand",
            "native": "New Zealand",
            "phone": "64",
            "continent": "OC",
            "capital": "Wellington",
            "currency": "NZD",
            "languages": [
                "en",
                "mi"
            ],
            "iso3": "NZL"
        },
        "OM": {
            "id": 169,
            "name": "Oman",
            "native": "عمان",
            "phone": "968",
            "continent": "AS",
            "capital": "Muscat",
            "currency": "OMR",
            "languages": [
                "ar"
            ],
            "iso3": "OMN"
        },
        "PA": {
            "id": 173,
            "name": "Panama",
            "native": "Panamá",
            "phone": "507",
            "continent": "NA",
            "capital": "Panama City",
            "currency": "PAB,USD",
            "languages": [
                "es"
            ],
            "iso3": "PAN"
        },
        "PE": {
            "id": 176,
            "name": "Peru",
            "native": "Perú",
            "phone": "51",
            "continent": "SA",
            "capital": "Lima",
            "currency": "PEN",
            "languages": [
                "es"
            ],
            "iso3": "PER"
        },
        "PF": {
            "id": 78,
            "name": "French Polynesia",
            "native": "Polynésie française",
            "phone": "689",
            "continent": "OC",
            "capital": "Papeetē",
            "currency": "XPF",
            "languages": [
                "fr"
            ],
            "iso3": "PYF"
        },
        "PG": {
            "id": 174,
            "name": "Papua New Guinea",
            "native": "Papua Niugini",
            "phone": "675",
            "continent": "OC",
            "capital": "Port Moresby",
            "currency": "PGK",
            "languages": [
                "en"
            ],
            "iso3": "PNG"
        },
        "PH": {
            "id": 177,
            "name": "Philippines",
            "native": "Pilipinas",
            "phone": "63",
            "continent": "AS",
            "capital": "Manila",
            "currency": "PHP",
            "languages": [
                "en"
            ],
            "iso3": "PHL"
        },
        "PK": {
            "id": 170,
            "name": "Pakistan",
            "native": "Pakistan",
            "phone": "92",
            "continent": "AS",
            "capital": "Islamabad",
            "currency": "PKR",
            "languages": [
                "en",
                "ur"
            ],
            "iso3": "PAK"
        },
        "PL": {
            "id": 179,
            "name": "Poland",
            "native": "Polska",
            "phone": "48",
            "continent": "EU",
            "capital": "Warsaw",
            "currency": "PLN",
            "languages": [
                "pl"
            ],
            "iso3": "POL"
        },
        "PM": {
            "id": 192,
            "name": "Saint Pierre and Miquelon",
            "native": "Saint-Pierre-et-Miquelon",
            "phone": "508",
            "continent": "NA",
            "capital": "Saint-Pierre",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "SPM"
        },
        "PN": {
            "id": 178,
            "name": "Pitcairn Islands",
            "native": "Pitcairn Islands",
            "phone": "64",
            "continent": "OC",
            "capital": "Adamstown",
            "currency": "NZD",
            "languages": [
                "en"
            ],
            "iso3": "PCN"
        },
        "PR": {
            "id": 181,
            "name": "Puerto Rico",
            "native": "Puerto Rico",
            "phone": "1787,1939",
            "continent": "NA",
            "capital": "San Juan",
            "currency": "USD",
            "languages": [
                "es",
                "en"
            ],
            "iso3": "PRI"
        },
        "PS": {
            "id": 172,
            "name": "Palestine",
            "native": "فلسطين",
            "phone": "970",
            "continent": "AS",
            "capital": "Ramallah",
            "currency": "ILS",
            "languages": [
                "ar"
            ],
            "iso3": "PSE"
        },
        "PT": {
            "id": 180,
            "name": "Portugal",
            "native": "Portugal",
            "phone": "351",
            "continent": "EU",
            "capital": "Lisbon",
            "currency": "EUR",
            "languages": [
                "pt"
            ],
            "iso3": "PRT"
        },
        "PW": {
            "id": 171,
            "name": "Palau",
            "native": "Palau",
            "phone": "680",
            "continent": "OC",
            "capital": "Ngerulmud",
            "currency": "USD",
            "languages": [
                "en"
            ],
            "iso3": "PLW"
        },
        "PY": {
            "id": 175,
            "name": "Paraguay",
            "native": "Paraguay",
            "phone": "595",
            "continent": "SA",
            "capital": "Asunción",
            "currency": "PYG",
            "languages": [
                "es",
                "gn"
            ],
            "iso3": "PRY"
        },
        "QA": {
            "id": 182,
            "name": "Qatar",
            "native": "قطر",
            "phone": "974",
            "continent": "AS",
            "capital": "Doha",
            "currency": "QAR",
            "languages": [
                "ar"
            ],
            "iso3": "QAT"
        },
        "RE": {
            "id": 183,
            "name": "Réunion",
            "native": "La Réunion",
            "phone": "262",
            "continent": "AF",
            "capital": "Saint-Denis",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "REU"
        },
        "RO": {
            "id": 184,
            "name": "Romania",
            "native": "România",
            "phone": "40",
            "continent": "EU",
            "capital": "Bucharest",
            "currency": "RON",
            "languages": [
                "ro"
            ],
            "iso3": "ROM"
        },
        "RS": {
            "id": 199,
            "name": "Serbia",
            "native": "Србија",
            "phone": "381",
            "continent": "EU",
            "capital": "Belgrade",
            "currency": "RSD",
            "languages": [
                "sr"
            ],
            "iso3": "SRB"
        },
        "RU": {
            "id": 185,
            "name": "Russia",
            "native": "Россия",
            "phone": "7",
            "continent": "EU",
            "capital": "Moscow",
            "currency": "RUB",
            "languages": [
                "ru"
            ],
            "iso3": "RUS"
        },
        "RW": {
            "id": 186,
            "name": "Rwanda",
            "native": "Rwanda",
            "phone": "250",
            "continent": "AF",
            "capital": "Kigali",
            "currency": "RWF",
            "languages": [
                "rw",
                "en",
                "fr"
            ],
            "iso3": "RWA"
        },
        "SA": {
            "id": 197,
            "name": "Saudi Arabia",
            "native": "العربية السعودية",
            "phone": "966",
            "continent": "AS",
            "capital": "Riyadh",
            "currency": "SAR",
            "languages": [
                "ar"
            ],
            "iso3": "SAU"
        },
        "SB": {
            "id": 207,
            "name": "Solomon Islands",
            "native": "Solomon Islands",
            "phone": "677",
            "continent": "OC",
            "capital": "Honiara",
            "currency": "SBD",
            "languages": [
                "en"
            ],
            "iso3": "SLB"
        },
        "SC": {
            "id": 201,
            "name": "Seychelles",
            "native": "Seychelles",
            "phone": "248",
            "continent": "AF",
            "capital": "Victoria",
            "currency": "SCR",
            "languages": [
                "fr",
                "en"
            ],
            "iso3": "SYC"
        },
        "SD": {
            "id": 214,
            "name": "Sudan",
            "native": "السودان",
            "phone": "249",
            "continent": "AF",
            "capital": "Khartoum",
            "currency": "SDG",
            "languages": [
                "ar",
                "en"
            ],
            "iso3": "SDN"
        },
        "SE": {
            "id": 218,
            "name": "Sweden",
            "native": "Sverige",
            "phone": "46",
            "continent": "EU",
            "capital": "Stockholm",
            "currency": "SEK",
            "languages": [
                "sv"
            ],
            "iso3": "SWE"
        },
        "SG": {
            "id": 203,
            "name": "Singapore",
            "native": "Singapore",
            "phone": "65",
            "continent": "AS",
            "capital": "Singapore",
            "currency": "SGD",
            "languages": [
                "en",
                "ms",
                "ta",
                "zh"
            ],
            "iso3": "SGP"
        },
        "SH": {
            "id": 188,
            "name": "Saint Helena",
            "native": "Saint Helena",
            "phone": "290",
            "continent": "AF",
            "capital": "Jamestown",
            "currency": "SHP",
            "languages": [
                "en"
            ],
            "iso3": "SHN"
        },
        "SI": {
            "id": 206,
            "name": "Slovenia",
            "native": "Slovenija",
            "phone": "386",
            "continent": "EU",
            "capital": "Ljubljana",
            "currency": "EUR",
            "languages": [
                "sl"
            ],
            "iso3": "SVN"
        },
        "SJ": {
            "id": 216,
            "name": "Svalbard and Jan Mayen",
            "native": "Svalbard og Jan Mayen",
            "phone": "4779",
            "continent": "EU",
            "capital": "Longyearbyen",
            "currency": "NOK",
            "languages": [
                "no"
            ],
            "iso3": "SJM"
        },
        "SK": {
            "id": 205,
            "name": "Slovakia",
            "native": "Slovensko",
            "phone": "421",
            "continent": "EU",
            "capital": "Bratislava",
            "currency": "EUR",
            "languages": [
                "sk"
            ],
            "iso3": "SVK"
        },
        "SL": {
            "id": 202,
            "name": "Sierra Leone",
            "native": "Sierra Leone",
            "phone": "232",
            "continent": "AF",
            "capital": "Freetown",
            "currency": "SLL",
            "languages": [
                "en"
            ],
            "iso3": "SLE"
        },
        "SM": {
            "id": 195,
            "name": "San Marino",
            "native": "San Marino",
            "phone": "378",
            "continent": "EU",
            "capital": "City of San Marino",
            "currency": "EUR",
            "languages": [
                "it"
            ],
            "iso3": "SMR"
        },
        "SN": {
            "id": 198,
            "name": "Senegal",
            "native": "Sénégal",
            "phone": "221",
            "continent": "AF",
            "capital": "Dakar",
            "currency": "XOF",
            "languages": [
                "fr"
            ],
            "iso3": "SEN"
        },
        "SO": {
            "id": 208,
            "name": "Somalia",
            "native": "Soomaaliya",
            "phone": "252",
            "continent": "AF",
            "capital": "Mogadishu",
            "currency": "SOS",
            "languages": [
                "so",
                "ar"
            ],
            "iso3": "SOM"
        },
        "SR": {
            "id": 215,
            "name": "Suriname",
            "native": "Suriname",
            "phone": "597",
            "continent": "SA",
            "capital": "Paramaribo",
            "currency": "SRD",
            "languages": [
                "nl"
            ],
            "iso3": "SUR"
        },
        "SS": {
            "id": 211,
            "name": "South Sudan",
            "native": "South Sudan",
            "phone": "211",
            "continent": "AF",
            "capital": "Juba",
            "currency": "SSP",
            "languages": [
                "en"
            ],
            "iso3": "SSD"
        },
        "ST": {
            "id": 196,
            "name": "São Tomé and Príncipe",
            "native": "São Tomé e Príncipe",
            "phone": "239",
            "continent": "AF",
            "capital": "São Tomé",
            "currency": "STN",
            "languages": [
                "pt"
            ],
            "iso3": "STP"
        },
        "SV": {
            "id": 67,
            "name": "El Salvador",
            "native": "El Salvador",
            "phone": "503",
            "continent": "NA",
            "capital": "San Salvador",
            "currency": "SVC,USD",
            "languages": [
                "es"
            ],
            "iso3": "SLV"
        },
        "SX": {
            "id": 204,
            "name": "Sint Maarten",
            "native": "Sint Maarten",
            "phone": "1721",
            "continent": "NA",
            "capital": "Philipsburg",
            "currency": "ANG",
            "languages": [
                "nl",
                "en"
            ],
            "iso3": "SXM"
        },
        "SY": {
            "id": 220,
            "name": "Syria",
            "native": "سوريا",
            "phone": "963",
            "continent": "AS",
            "capital": "Damascus",
            "currency": "SYP",
            "languages": [
                "ar"
            ],
            "iso3": "SYR"
        },
        "SZ": {
            "id": 217,
            "name": "Swaziland",
            "native": "Swaziland",
            "phone": "268",
            "continent": "AF",
            "capital": "Lobamba",
            "currency": "SZL",
            "languages": [
                "en",
                "ss"
            ],
            "iso3": "SWZ"
        },
        "TC": {
            "id": 233,
            "name": "Turks and Caicos Islands",
            "native": "Turks and Caicos Islands",
            "phone": "1649",
            "continent": "NA",
            "capital": "Cockburn Town",
            "currency": "USD",
            "languages": [
                "en"
            ],
            "iso3": "TCA"
        },
        "TD": {
            "id": 44,
            "name": "Chad",
            "native": "Tchad",
            "phone": "235",
            "continent": "AF",
            "capital": "N'Djamena",
            "currency": "XAF",
            "languages": [
                "fr",
                "ar"
            ],
            "iso3": "TCD"
        },
        "TF": {
            "id": 79,
            "name": "French Southern Territories",
            "native": "Territoire des Terres australes et antarctiques fr",
            "phone": "262",
            "continent": "AN",
            "capital": "Port-aux-Français",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "ATF"
        },
        "TG": {
            "id": 226,
            "name": "Togo",
            "native": "Togo",
            "phone": "228",
            "continent": "AF",
            "capital": "Lomé",
            "currency": "XOF",
            "languages": [
                "fr"
            ],
            "iso3": "TGO"
        },
        "TH": {
            "id": 224,
            "name": "Thailand",
            "native": "ประเทศไทย",
            "phone": "66",
            "continent": "AS",
            "capital": "Bangkok",
            "currency": "THB",
            "languages": [
                "th"
            ],
            "iso3": "THA"
        },
        "TJ": {
            "id": 222,
            "name": "Tajikistan",
            "native": "Тоҷикистон",
            "phone": "992",
            "continent": "AS",
            "capital": "Dushanbe",
            "currency": "TJS",
            "languages": [
                "tg",
                "ru"
            ],
            "iso3": "TJK"
        },
        "TK": {
            "id": 227,
            "name": "Tokelau",
            "native": "Tokelau",
            "phone": "690",
            "continent": "OC",
            "capital": "Fakaofo",
            "currency": "NZD",
            "languages": [
                "en"
            ],
            "iso3": "TKL"
        },
        "TL": {
            "id": 225,
            "name": "East Timor",
            "native": "Timor-Leste",
            "phone": "670",
            "continent": "OC",
            "capital": "Dili",
            "currency": "USD",
            "languages": [
                "pt"
            ],
            "iso3": "TLS"
        },
        "TM": {
            "id": 232,
            "name": "Turkmenistan",
            "native": "Türkmenistan",
            "phone": "993",
            "continent": "AS",
            "capital": "Ashgabat",
            "currency": "TMT",
            "languages": [
                "tk",
                "ru"
            ],
            "iso3": "TKM"
        },
        "TN": {
            "id": 230,
            "name": "Tunisia",
            "native": "تونس",
            "phone": "216",
            "continent": "AF",
            "capital": "Tunis",
            "currency": "TND",
            "languages": [
                "ar"
            ],
            "iso3": "TUN"
        },
        "TO": {
            "id": 228,
            "name": "Tonga",
            "native": "Tonga",
            "phone": "676",
            "continent": "OC",
            "capital": "Nuku'alofa",
            "currency": "TOP",
            "languages": [
                "en",
                "to"
            ],
            "iso3": "TON"
        },
        "TR": {
            "id": 231,
            "name": "Turkey",
            "native": "Türkiye",
            "phone": "90",
            "continent": "AS",
            "capital": "Ankara",
            "currency": "TRY",
            "languages": [
                "tr"
            ],
            "iso3": "TUR"
        },
        "TT": {
            "id": 229,
            "name": "Trinidad and Tobago",
            "native": "Trinidad and Tobago",
            "phone": "1868",
            "continent": "NA",
            "capital": "Port of Spain",
            "currency": "TTD",
            "languages": [
                "en"
            ],
            "iso3": "TTO"
        },
        "TV": {
            "id": 234,
            "name": "Tuvalu",
            "native": "Tuvalu",
            "phone": "688",
            "continent": "OC",
            "capital": "Funafuti",
            "currency": "AUD",
            "languages": [
                "en"
            ],
            "iso3": "TUV"
        },
        "TW": {
            "id": 221,
            "name": "Taiwan",
            "native": "臺灣",
            "phone": "886",
            "continent": "AS",
            "capital": "Taipei",
            "currency": "TWD",
            "languages": [
                "zh"
            ],
            "iso3": "TWN"
        },
        "TZ": {
            "id": 223,
            "name": "Tanzania",
            "native": "Tanzania",
            "phone": "255",
            "continent": "AF",
            "capital": "Dodoma",
            "currency": "TZS",
            "languages": [
                "sw",
                "en"
            ],
            "iso3": "TZA"
        },
        "UA": {
            "id": 236,
            "name": "Ukraine",
            "native": "Україна",
            "phone": "380",
            "continent": "EU",
            "capital": "Kyiv",
            "currency": "UAH",
            "languages": [
                "uk"
            ],
            "iso3": "UKR"
        },
        "UG": {
            "id": 235,
            "name": "Uganda",
            "native": "Uganda",
            "phone": "256",
            "continent": "AF",
            "capital": "Kampala",
            "currency": "UGX",
            "languages": [
                "en",
                "sw"
            ],
            "iso3": "UGA"
        },
        "UM": {
            "id": 240,
            "name": "U.S. Minor Outlying Islands",
            "native": "United States Minor Outlying Islands",
            "phone": "1",
            "continent": "OC",
            "capital": "",
            "currency": "USD",
            "languages": [
                "en"
            ],
            "iso3": "UMI"
        },
        "US": {
            "id": 239,
            "name": "United States",
            "native": "United States",
            "phone": "1",
            "continent": "NA",
            "capital": "Washington D.C.",
            "currency": "USD,USN,USS",
            "languages": [
                "en"
            ],
            "iso3": "USA"
        },
        "UY": {
            "id": 241,
            "name": "Uruguay",
            "native": "Uruguay",
            "phone": "598",
            "continent": "SA",
            "capital": "Montevideo",
            "currency": "UYI,UYU",
            "languages": [
                "es"
            ],
            "iso3": "URY"
        },
        "UZ": {
            "id": 242,
            "name": "Uzbekistan",
            "native": "O‘zbekiston",
            "phone": "998",
            "continent": "AS",
            "capital": "Tashkent",
            "currency": "UZS",
            "languages": [
                "uz",
                "ru"
            ],
            "iso3": "UZB"
        },
        "VA": {
            "id": 98,
            "name": "Vatican City",
            "native": "Vaticano",
            "phone": "379",
            "continent": "EU",
            "capital": "Vatican City",
            "currency": "EUR",
            "languages": [
                "it",
                "la"
            ],
            "iso3": "VAT"
        },
        "VC": {
            "id": 193,
            "name": "Saint Vincent and the Grenadines",
            "native": "Saint Vincent and the Grenadines",
            "phone": "1784",
            "continent": "NA",
            "capital": "Kingstown",
            "currency": "XCD",
            "languages": [
                "en"
            ],
            "iso3": "VCT"
        },
        "VE": {
            "id": 244,
            "name": "Venezuela",
            "native": "Venezuela",
            "phone": "58",
            "continent": "SA",
            "capital": "Caracas",
            "currency": "VES",
            "languages": [
                "es"
            ],
            "iso3": "VEN"
        },
        "VG": {
            "id": 246,
            "name": "British Virgin Islands",
            "native": "British Virgin Islands",
            "phone": "1284",
            "continent": "NA",
            "capital": "Road Town",
            "currency": "USD",
            "languages": [
                "en"
            ],
            "iso3": "VGB"
        },
        "VI": {
            "id": 247,
            "name": "U.S. Virgin Islands",
            "native": "United States Virgin Islands",
            "phone": "1340",
            "continent": "NA",
            "capital": "Charlotte Amalie",
            "currency": "USD",
            "languages": [
                "en"
            ],
            "iso3": "VIR"
        },
        "VN": {
            "id": 245,
            "name": "Vietnam",
            "native": "Việt Nam",
            "phone": "84",
            "continent": "AS",
            "capital": "Hanoi",
            "currency": "VND",
            "languages": [
                "vi"
            ],
            "iso3": "VNM"
        },
        "VU": {
            "id": 243,
            "name": "Vanuatu",
            "native": "Vanuatu",
            "phone": "678",
            "continent": "OC",
            "capital": "Port Vila",
            "currency": "VUV",
            "languages": [
                "bi",
                "en",
                "fr"
            ],
            "iso3": "VUT"
        },
        "WF": {
            "id": 248,
            "name": "Wallis and Futuna",
            "native": "Wallis et Futuna",
            "phone": "681",
            "continent": "OC",
            "capital": "Mata-Utu",
            "currency": "XPF",
            "languages": [
                "fr"
            ],
            "iso3": "WLF"
        },
        "WS": {
            "id": 194,
            "name": "Samoa",
            "native": "Samoa",
            "phone": "685",
            "continent": "OC",
            "capital": "Apia",
            "currency": "WST",
            "languages": [
                "sm",
                "en"
            ],
            "iso3": "WSM"
        },
        "XK": {
            "id": 120,
            "name": "Kosovo",
            "native": "Republika e Kosovës",
            "phone": "377,381,383,386",
            "continent": "EU",
            "capital": "Pristina",
            "currency": "EUR",
            "languages": [
                "sq",
                "sr"
            ],
            "iso3": "XKX"
        },
        "YE": {
            "id": 250,
            "name": "Yemen",
            "native": "اليَمَن",
            "phone": "967",
            "continent": "AS",
            "capital": "Sana'a",
            "currency": "YER",
            "languages": [
                "ar"
            ],
            "iso3": "YEM"
        },
        "YT": {
            "id": 144,
            "name": "Mayotte",
            "native": "Mayotte",
            "phone": "262",
            "continent": "AF",
            "capital": "Mamoudzou",
            "currency": "EUR",
            "languages": [
                "fr"
            ],
            "iso3": "MYT"
        },
        "ZA": {
            "id": 209,
            "name": "South Africa",
            "native": "South Africa",
            "phone": "27",
            "continent": "AF",
            "capital": "Pretoria",
            "currency": "ZAR",
            "languages": [
                "af",
                "en",
                "nr",
                "st",
                "ss",
                "tn",
                "ts",
                "ve",
                "xh",
                "zu"
            ],
            "iso3": "ZAF"
        },
        "ZM": {
            "id": 251,
            "name": "Zambia",
            "native": "Zambia",
            "phone": "260",
            "continent": "AF",
            "capital": "Lusaka",
            "currency": "ZMW",
            "languages": [
                "en"
            ],
            "iso3": "ZMB"
        },
        "ZW": {
            "id": 252,
            "name": "Zimbabwe",
            "native": "Zimbabwe",
            "phone": "263",
            "continent": "AF",
            "capital": "Harare",
            "currency": "USD,ZAR,BWP,GBP,AUD,CNY,INR,JPY",
            "languages": [
                "en",
                "sn",
                "nd"
            ],
            "iso3": "ZWE"
        }
    }
    private countriesByID: Record<string, any>;
    private countriesByISO3: Record<string, any>;

    constructor() {
        const id_map = new Map();
        const iso3_map = new Map();
        for (const item in this.countries) {
            const current_country: CountryRecord = this.countries[item];
            current_country["iso2"] = item;
            id_map.set(Number(this.countries[item].id), current_country);
            iso3_map.set(this.countries[item].iso3, current_country);
        }
        this.countriesByID = new Map([...id_map.entries()].sort((a, b) => {
            if (a[0] > b[0]) {return 1;}
            if (a[0] === b[0]) {return 0;}
            if (a[0] < b[0]) {return -1;}
        }));
        this.countriesByISO3 = new Map([...iso3_map.entries()].sort());
    }

    getIDFromISO2(iso2: string) {
        if (this.countries.hasOwnProperty(iso2)) {
            return this.countries[iso2].id;
        }
        return null;
    }

    getIDFromISO3(iso3: string) {
        if (this.countriesByISO3.has(iso3)) {
            return this.countriesByISO3.get(iso3).id;
        }
        return null;
    }

    getCountryById(id: number): CountryRecord {
        return this.countriesByID.get(id);
    }

    getCountryByISO3(iso3: string): CountryRecord {
        return this.countriesByISO3.get(iso3);
    }

}

export default Country;
