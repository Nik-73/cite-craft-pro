# Document Collection Strategy
## Indian Regional Language District Court Judgments

**Date**: 2025-11-17
**Research Phase**: Data Collection Planning
**Target**: 400+ district court judgments across 10 regional languages

---

## DATA SOURCE IDENTIFICATION

### **Primary Sources**

#### **1. Indian Kanoon (indiankanoon.org)**
**Status**: Best primary source for Indian case law

**Coverage**:
- Supreme Court: 100% coverage
- High Courts: 90%+ coverage
- District Courts: Partial but growing (~30-40%)
- Tribunals: Extensive

**Advantages**:
- ✅ Free and publicly accessible
- ✅ Full-text search capability
- ✅ Supports regional language searches (limited)
- ✅ API-like access through structured URLs
- ✅ No rate limiting (respectful use)
- ✅ Metadata: Court, date, judges, citations, cited cases
- ✅ Download-friendly (HTML/text)

**Limitations**:
- ⚠️ District court coverage incomplete
- ⚠️ Regional language judgments under-represented
- ⚠️ No language filter (must search by script/keywords)
- ⚠️ Quality varies (OCR errors in old judgments)

**Search Strategy**:
```
Base URL: https://indiankanoon.org/search/
Parameters:
  - formInput={search terms}
  - pagenum={page number}
  - court={court name filter}
  - fromdate={YYYY-MM-DD}
  - todate={YYYY-MM-DD}
  - exactphrase={exact phrase matching}
```

**Regional Language Search**:
- Use Unicode terms for concepts (e.g., "सहमति", "கொடூரம்")
- Filter by state High Courts (judgments more likely in regional language)
- Target district names in regional scripts

---

#### **2. eCourts Services Portal (districts.ecourts.gov.in)**
**Status**: Official repository - most authoritative

**Coverage**:
- District Courts: 100% (all computerized courts)
- Regional Languages: Excellent (official medium)
- Temporal: 2015+ (digitization era)

**Advantages**:
- ✅ Official government source
- ✅ District-level granularity
- ✅ Regional language original judgments
- ✅ Metadata: CNR number, case number, filing date, disposal date
- ✅ Free public access
- ✅ State-wise navigation

**Limitations**:
- ⚠️ No centralized search across all districts
- ⚠️ State-specific portals vary in interface
- ⚠️ Limited search functionality (case number, party name, mostly)
- ⚠️ No content-based search in most states
- ⚠️ Manual download required
- ⚠️ CAPTCHA protection on some portals

**Access Strategy**:
- State-wise portal navigation
- Target specific district courts by region
- Use CNR/case number if known
- Party name search for common patterns
- Manual review and selection

**Target States by Language**:
| Language | States | District Courts to Target |
|----------|--------|---------------------------|
| Hindi | UP, Bihar, MP, Rajasthan, Jharkhand, Chhattisgarh, Haryana, Himachal | Lucknow, Allahabad, Patna, Bhopal, Jaipur, Ranchi, Raipur |
| Tamil | Tamil Nadu | Chennai, Madurai, Coimbatore, Salem |
| Telugu | Andhra Pradesh, Telangana | Hyderabad, Visakhapatnam, Vijayawada, Guntur |
| Bengali | West Bengal, Tripura | Kolkata, Howrah, Siliguri |
| Marathi | Maharashtra | Mumbai, Pune, Nagpur, Aurangabad |
| Kannada | Karnataka | Bangalore, Mysore, Hubli, Mangalore |
| Malayalam | Kerala | Thiruvananthapuram, Ernakulam, Kozhikode |
| Gujarati | Gujarat | Ahmedabad, Surat, Vadodara, Rajkot |
| Punjabi | Punjab, Chandigarh | Ludhiana, Amritsar, Jalandhar, Patiala |
| Odia | Odisha | Bhubaneswar, Cuttack, Berhampur |

---

#### **3. State High Court Websites**
**Status**: Secondary source, some have district court databases

**Select High Courts with Good Digitization**:
- **Delhi High Court**: Excellent database, English + Hindi
- **Bombay High Court**: Good district court coverage
- **Madras High Court**: Tamil judgments available
- **Karnataka High Court**: Kannada judgments available
- **Kerala High Court**: Malayalam judgments available
- **Allahabad High Court**: Large Hindi coverage

**Access Strategy**:
- Navigate to "District Court Judgments" or "Subordinate Court" sections
- Use advanced search if available
- Filter by date range: 2015-2024
- Download PDFs/HTML

---

#### **4. Manupatra / SCC Online (Commercial - Limited Use)**
**Status**: Premium databases with excellent coverage

**Note**: These require paid subscriptions. Recommend:
- University library access if available
- Trial subscriptions for initial dataset building
- Focus on difficult-to-find languages (Odia, Punjabi)

**Advantages**:
- ✅ Comprehensive district court coverage
- ✅ Advanced search (concept-based, keyword, citation)
- ✅ Better metadata and indexing
- ✅ Regional language judgments tagged
- ✅ Export-friendly formats

---

### **Secondary Sources**

#### **5. RTI Requests to District Courts**
For gaps in coverage, especially for:
- Regional language judgments not digitized
- Specific concept-based requests
- Quality control (certified copies)

**Template RTI Application**:
```
To: Public Information Officer
[District Court Name]

Under RTI Act 2005, please provide:
1. Copies of judgments in [Language] decided between [dates]
2. Involving interpretation of [Legal Concept - IPC Section]
3. In criminal/civil cases
4. Digital format (PDF/text) preferred
5. Total count of such cases

Purpose: Academic legal research on multilingual legal reasoning
```

---

#### **6. University Law Libraries**
- National Law Universities (NLUs) often have unreported judgment archives
- Regional universities may have local language collections
- Physical access or digital requests

---

## SEARCH PARAMETERS BY CONCEPT

### **1. CONSENT (Primary Focus - 150 judgments)**

#### **IPC Sections to Search**:
- **Section 375** (Rape) - requires lack of consent
- **Section 376** (Punishment for rape)
- **Section 354** (Assault/criminal force to woman with intent to outrage modesty)
- **Section 354A** (Sexual harassment)
- **Section 354B** (Assault/use of criminal force to woman with intent to disrobe)
- **Section 354C** (Voyeurism)
- **Section 354D** (Stalking)
- **Section 363-366** (Kidnapping/abduction cases involving consent issues)

**Search Keywords**:

| Language | Keywords for "Consent" | Keywords for "Without Consent" | Related Terms |
|----------|------------------------|-------------------------------|---------------|
| Hindi | सहमति, राज़ी, इच्छा, अनुमति | बिना सहमति, ज़बरदस्ती, मनाही, इनकार | स्वतंत्र सहमति, मुक्त सहमति |
| Tamil | சம்மதம், இணக்கம், விருப்பம் | சம்மதமின்றி, வற்புறுத்தல், மறுப்பு | தன்னார்வ சம்மதம் |
| Telugu | సమ్మతి, ఒప్పందం, కోరిక | సమ్మతి లేకుండా, బలవంతం, తిరస్కరణ | స్వేచ్ఛా సమ్మతి |
| Bengali | সম্মতি, ইচ্ছা, অনুমতি | সম্মতি ছাড়া, জোরপূর্বক, অস্বীকার | স্বাধীন সম্মতি |
| Marathi | संमती, इच्छा, परवानगी | संमतीशिवाय, जबरदस्ती, नकार | स्वतंत्र संमती |
| Kannada | ಒಪ್ಪಿಗೆ, ಇಚ್ಛೆ, ಅನುಮತಿ | ಒಪ್ಪಿಗೆ ಇಲ್ಲದೆ, ಬಲವಂತ, ನಿರಾಕರಣೆ | ಸ್ವತಂತ್ರ ಒಪ್ಪಿಗೆ |
| Malayalam | സമ്മതം, ഇഷ്ടം, അനുമതി | സമ്മതം കൂടാതെ, ബലപ്രയോഗം, നിരാകരണം | സ്വതന്ത്ര സമ്മതം |
| Gujarati | સંમતિ, ઇચ્છા, પરવાનગી | સંમતિ વગર, બળજબરી, ઇનકાર | સ્વતંત્ર સંમતિ |
| Punjabi | ਸਹਿਮਤੀ, ਇੱਛਾ, ਇਜਾਜ਼ਤ | ਸਹਿਮਤੀ ਬਿਨਾਂ, ਜ਼ਬਰਦਸਤੀ, ਇਨਕਾਰ | ਸੁਤੰਤਰ ਸਹਿਮਤੀ |
| Odia | ସମ୍ମତି, ଇଚ୍ଛା, ଅନୁମତି | ସମ୍ମତି ବିନା, ବଳପୂର୍ବକ, ପ୍ରତ୍ୟାଖ୍ୟାନ | ସ୍ୱାଧୀନ ସମ୍ମତି |

**Case Selection Criteria**:
- District/Sessions Court level
- Detailed reasoning on consent (not guilty plea cases)
- Witness testimony present (victim, accused, witnesses)
- Involves consent ambiguity or dispute (not clear-cut cases)
- Preferably trial judgments (not just appellate orders)
- 2015-2024 timeline
- **Avoid**: Supreme Court/High Court judgments, English-only judgments

**Target Distribution**:
- Hindi: 30 judgments
- Tamil: 15 judgments
- Telugu: 15 judgments
- Bengali: 15 judgments
- Marathi: 15 judgments
- Kannada: 15 judgments
- Malayalam: 15 judgments
- Gujarati: 10 judgments
- Punjabi: 10 judgments
- Odia: 10 judgments
**Total**: 150 judgments

---

### **2. DISHONEST INTENTION (Secondary Focus - 75 judgments)**

#### **IPC Sections to Search**:
- **Section 378** (Theft)
- **Section 405** (Criminal breach of trust)
- **Section 415** (Cheating)
- **Section 420** (Cheating and dishonestly inducing delivery of property)
- **Section 403** (Dishonest misappropriation of property)

**Search Keywords**:

| Language | Keywords for "Dishonest Intention" | Related Terms |
|----------|-----------------------------------|---------------|
| Hindi | बेईमानी का इरादा, धोखाधड़ी का इरादा, कपटपूर्ण इरादा | बेईमानी, धोखा, ठगी, फ़रेब |
| Tamil | நேர்மையற்ற நோக்கம், மோசடி நோக்கம் | நேர்மையின்மை, ஏமாற்றுதல் |
| Telugu | నిజాయితీ లేని ఉద్దేశం, మోసపూరిత ఉద్దేశం | నిజాయితీ లేకపోవడం, మోసం |
| Bengali | অসাধু উদ্দেশ্য, প্রতারণামূলক উদ্দেশ্য | অসততা, প্রতারণা, ঠগবাজি |
| Marathi | अप्रामाणिक हेतू, फसवणूक हेतू | अप्रामाणिकता, फसवणूक |
| Kannada | ಅಪ್ರಾಮಾಣಿಕ ಉದ್ದೇಶ, ವಂಚನೆಯ ಉದ್ದೇಶ | ಅಪ್ರಾಮಾಣಿಕತೆ, ವಂಚನೆ |
| Malayalam | സത്യസന്ധതയില്ലാത്ത ഉദ്ദേശം, വഞ്ചനാപരമായ ഉദ്ദേശം | സത്യസന്ധതക്കുറവ്, വഞ്ചന |
| Gujarati | બેપ્રમાણિક ઇરાદો, છેતરપિંડીનો ઇરાદો | બેપ્રમાણિકતા, છેતરપિંડી |
| Punjabi | ਬੇਈਮਾਨੀ ਦਾ ਇਰਾਦਾ, ਧੋਖੇ ਦਾ ਇਰਾਦਾ | ਬੇਈਮਾਨੀ, ਧੋਖਾ |
| Odia | ଅସାଧୁ ଉଦ୍ଦେଶ୍ୟ, ପ୍ରତାରଣା ଉଦ୍ଦେଶ୍ୟ | ଅସାଧୁତା, ପ୍ରତାରଣା |

**Case Selection Criteria**:
- District Court level
- Detailed analysis of mens rea
- Distinguishes between intention, knowledge, negligence
- Witness testimony about accused's conduct
- Involves fact pattern requiring intent determination
- 2015-2024 timeline

**Target Distribution**:
- Hindi: 15 judgments
- Tamil: 8 judgments
- Telugu: 7 judgments
- Bengali: 7 judgments
- Marathi: 7 judgments
- Kannada: 7 judgments
- Malayalam: 7 judgments
- Gujarati: 6 judgments
- Punjabi: 6 judgments
- Odia: 5 judgments
**Total**: 75 judgments

---

### **3. REASONABLE DOUBT (Secondary Focus - 75 judgments)**

#### **Search Strategy**:
- Any criminal trial judgment (conviction or acquittal)
- Must contain discussion of evidentiary standard
- Look for phrases explaining "beyond reasonable doubt"

**Search Keywords**:

| Language | Keywords |
|----------|----------|
| Hindi | उचित संदेह, युक्तियुक्त संदेह, संदेह से परे, संदेह का लाभ |
| Tamil | நியாயமான சந்தேகம், சந்தேகத்திற்கு அப்பால், சந்தேக நன்மை |
| Telugu | సహేతుకమైన సందేహం, సందేహానికి అతీతంగా, సందేహ లాభం |
| Bengali | যুক্তিসঙ্গত সন্দেহ, সন্দেহের ঊর্ধ্বে, সন্দেহের সুবিধা |
| Marathi | वाजवी शंका, शंकेच्या पलीकडे, शंकेचा लाभ |
| Kannada | ಸಮಂಜಸವಾದ ಸಂಶಯ, ಸಂಶಯಕ್ಕೆ ಅತೀತವಾಗಿ, ಸಂಶಯದ ಲಾಭ |
| Malayalam | ന്യായമായ സംശയം, സംശയത്തിനതീതം, സംശയത്തിന്റെ ആനുകൂല്യം |
| Gujarati | વાજબી શંકા, શંકાથી આગળ, શંકાનો લાભ |
| Punjabi | ਵਾਜਬ ਸ਼ੱਕ, ਸ਼ੱਕ ਤੋਂ ਪਰੇ, ਸ਼ੱਕ ਦਾ ਲਾਭ |
| Odia | ଯୁକ୍ତିଯୁକ୍ତ ସନ୍ଦେହ, ସନ୍ଦେହ ବାହାରେ, ସନ୍ଦେହର ଲାଭ |

**Case Selection Criteria**:
- Criminal trial judgments (all offenses)
- Contains explanation of evidentiary burden
- Discusses "reasonable doubt" concept explicitly
- Preferably cases with conflicting evidence
- 2015-2024 timeline

**Target Distribution**: Same as Dishonest Intention (75 total)

---

### **4. SEXUAL HARASSMENT (Tertiary Focus - 50 judgments)**

#### **Sources to Search**:
- Workplace complaints under Sexual Harassment of Women at Workplace Act, 2013
- IPC 354A cases
- Internal Complaints Committee (ICC) reports (if published)

**Search Keywords**:

| Language | Keywords |
|----------|----------|
| Hindi | यौन उत्पीड़न, अवांछित यौन प्रगति, यौन टिप्पणी |
| Tamil | பாலியல் துன்புறுத்தல், விரும்பத்தகாத பாலியல் முன்னேற்றம் |
| Telugu | లైంగిక వేధింపు, అవాంఛిత లైంగిక ముందస్తు |
| Bengali | যৌন হয়রানি, অবাঞ্ছিত যৌন অগ্রগতি |
| Marathi | लैंगिक छळ, अवांछित लैंगिक प्रगती |
| Kannada | ಲೈಂಗಿಕ ಕಿರುಕುಳ, ಅನಗತ್ಯ ಲೈಂಗಿಕ ಪ್ರಗತಿ |
| Malayalam | ലൈംഗിക പീഡനം, അനാവശ്യ ലൈംഗിക മുന്നേറ്റം |
| Gujarati | જાતીય સતામણી, અનિચ્છનીય જાતીય પ્રગતિ |
| Punjabi | ਜਿਨਸੀ ਪਰੇਸ਼ਾਨੀ, ਅਣਚਾਹੇ ਜਿਨਸੀ ਤਰੱਕੀ |
| Odia | ଯୌନ ନିର୍ଯ୍ୟାତନା, ଅବାଞ୍ଛିତ ଯୌନ ଅଗ୍ରଗତି |

**Target Distribution**: 5 per language (50 total)

---

### **5. CRUELTY (Tertiary Focus - 50 judgments)**

#### **IPC Sections**:
- **Section 498A** (Cruelty by husband/relatives)
- Divorce petitions citing cruelty

**Search Keywords**:

| Language | Keywords |
|----------|----------|
| Hindi | क्रूरता, मानसिक क्रूरता, शारीरिक क्रूरता, उत्पीड़न |
| Tamil | கொடூரம், மனரீதியான கொடூரம், உடல்ரீதியான கொடூரம் |
| Telugu | క్రూరత్వం, మానసిక క్రూరత్వం, శారీరక క్రూరత్వం |
| Bengali | নিষ্ঠুরতা, মানসিক নিষ্ঠুরতা, শারীরিক নিষ্ঠুরতা |
| Marathi | क्रूरता, मानसिक क्रूरता, शारीरिक क्रूरता |
| Kannada | ಕ್ರೂರತೆ, ಮಾನಸಿಕ ಕ್ರೂರತೆ, ಭೌತಿಕ ಕ್ರೂರತೆ |
| Malayalam | ക്രൂരത, മാനസിക ക്രൂരത, ശാരീരിക ക്രൂരത |
| Gujarati | ક્રૂરતા, માનસિક ક્રૂરતા, શારીરિક ક્રૂરતા |
| Punjabi | ਬੇਰਹਿਮੀ, ਮਾਨਸਿਕ ਬੇਰਹਿਮੀ, ਸਰੀਰਕ ਬੇਰਹਿਮੀ |
| Odia | ନିଷ୍ଠୁରତା, ମାନସିକ ନିଷ୍ଠୁରତା, ଶାରୀରିକ ନିଷ୍ଠୁରତା |

**Target Distribution**: 5 per language (50 total)

---

## QUALITY CONTROL CRITERIA

### **Inclusion Criteria** (ALL must be met):
1. ✅ **Court Level**: District Court / Sessions Court / Subordinate Court
2. ✅ **Language**: Primarily in target regional language (>70% of text)
3. ✅ **Date**: 2015-2024
4. ✅ **Length**: Minimum 5 pages (substantial reasoning)
5. ✅ **Reasoning Depth**: Detailed analysis of legal concept (not formulaic)
6. ✅ **Witness Testimony**: Includes examination/cross-examination transcripts
7. ✅ **Legal Interpretation**: Court discusses meaning of legal concept
8. ✅ **Concept Centrality**: Selected legal concept is central to decision

### **Exclusion Criteria** (ANY excludes):
1. ❌ **Language**: English-only or translation of English judgment
2. ❌ **Court Level**: High Court, Supreme Court (unless district court facts are detailed)
3. ❌ **Type**: Procedural orders, bail orders, interim orders
4. ❌ **Reasoning**: Formulaic application without interpretation
5. ❌ **Guilty Plea**: Confessed cases (no reasoning on elements)
6. ❌ **OCR Quality**: Illegible or severely corrupted text
7. ❌ **Length**: <5 pages (insufficient for semantic analysis)

---

## DATA COLLECTION WORKFLOW

### **Phase 1: Initial Survey (Weeks 1-2)**
1. Test search parameters on IndianKanoon for each language
2. Identify 5-10 sample judgments per concept per language
3. Assess availability and quality
4. Refine search terms based on actual usage

### **Phase 2: Database Scraper Development (Weeks 2-4)**
1. Build IndianKanoon scraper
2. Build eCourts portal scraper (state-by-state)
3. Test rate limiting and ethical scraping
4. Implement metadata extraction

### **Phase 3: Systematic Collection (Weeks 4-8)**
1. Run automated searches for each concept × language combination
2. Download all potentially relevant judgments
3. Manual review and filtering
4. Quality control check
5. Organize by concept/language/court

### **Phase 4: Gap Filling (Weeks 8-10)**
1. Identify underrepresented language/concept combinations
2. Use secondary sources (Manupatra, RTI requests)
3. Reach target distribution

### **Phase 5: Corpus Finalization (Week 10)**
1. Final quality review
2. Create master index
3. Extract metadata into structured database
4. Prepare for analysis phase

---

## TECHNICAL INFRASTRUCTURE REQUIREMENTS

### **Scraper Requirements**:
```typescript
interface IndianJudgment {
  // Identifiers
  caseNumber: string;
  cnrNumber?: string;
  indianKanoonId?: string;

  // Court Information
  court: string;
  district?: string;
  state: string;
  courtLevel: 'District' | 'Sessions' | 'Subordinate';

  // Case Details
  title: string;
  parties: {
    petitioner: string;
    respondent: string;
  };

  // Dates
  filingDate?: string;
  decisionDate: string;

  // Judges
  judges: string[];

  // Content
  language: string; // ISO 639 code
  fullText: string;
  sections: {
    facts?: string;
    evidence?: string;
    witnessTestimony?: string;
    legalDiscussion?: string;
    reasoning?: string;
    conclusion?: string;
  };

  // Legal Metadata
  ipcSections: string[];
  citedCases: string[];
  statutes: string[];

  // Research Metadata
  primaryConcept: string; // "consent" | "dishonest_intention" | etc.
  languagePercentage: number; // % in regional language vs English
  hasWitnessTestimony: boolean;
  reasoningDepth: 'shallow' | 'moderate' | 'deep';

  // Source
  sourceUrl: string;
  sourceDatabase: string;
  downloadDate: string;

  // Quality Flags
  ocrQuality?: 'excellent' | 'good' | 'fair' | 'poor';
  completeness: boolean;
  notes?: string;
}
```

### **Storage**:
- Database: PostgreSQL with full-text search
- Document store: Local filesystem with structured directories
- Metadata: JSON export for portability
- Backup: Cloud storage (Google Drive / Dropbox)

### **Directory Structure**:
```
/data/
  /judgments/
    /consent/
      /hindi/
        judgment_001.html
        judgment_001.json (metadata)
      /tamil/
      /telugu/
      ...
    /dishonest_intention/
    /reasonable_doubt/
    /sexual_harassment/
    /cruelty/

  /corpus_metadata/
    master_index.json
    collection_statistics.json
    quality_reports.json
```

---

## ETHICAL CONSIDERATIONS

### **Data Collection Ethics**:
1. ✅ Respect robots.txt and rate limits
2. ✅ Use public databases only (no hacking/unauthorized access)
3. ✅ Cite sources properly
4. ✅ Do not redistribute copyrighted material
5. ✅ Anonymize parties if publishing excerpts (research purposes only)

### **Research Ethics**:
1. ✅ Academic research purpose
2. ✅ No commercial use
3. ✅ Fair use doctrine applies
4. ✅ Publicly available judgments (no privacy violation)

---

## SUCCESS METRICS

### **Target Dataset**:
- **Total Judgments**: 400
- **Languages**: 10
- **Concepts**: 5
- **Timeframe**: 2015-2024
- **Average Length**: 10-15 pages
- **Total Corpus Size**: ~4,000-6,000 pages of legal text

### **Quality Metrics**:
- **Reasoning Depth**: 80% moderate-to-deep
- **Witness Testimony**: 90% include transcripts
- **Language Purity**: 70%+ in regional language
- **OCR Quality**: 90% good-to-excellent
- **Concept Centrality**: 95% concept is decisive issue

### **Coverage Metrics**:
- **Geographic**: All 10 target states represented
- **Temporal**: Even distribution 2015-2024
- **Court Type**: District/Sessions only
- **Gender Representation**: For consent/harassment cases, diverse fact patterns

---

## TIMELINE

| Week | Activities | Deliverables |
|------|------------|--------------|
| 1-2 | Initial survey, search parameter testing | Refined search terms, 50 sample judgments |
| 2-4 | Scraper development | Working scrapers for IndianKanoon, eCourts |
| 4-8 | Systematic collection | 300+ judgments collected |
| 8-10 | Gap filling, secondary sources | Complete 400-judgment corpus |
| 10 | Corpus finalization | Master index, metadata database, ready for analysis |

---

## NEXT STEPS

1. ✅ **Document Collection Strategy Complete**
2. ⏭️ **Build Technical Infrastructure**
   - Develop IndianKanoon scraper
   - Develop eCourts scraper
   - Set up database and storage
3. ⏭️ **Begin Phase 1: Initial Survey**
   - Test searches across all languages
   - Collect sample judgments
   - Validate approach
4. ⏭️ **Develop Analytical Framework**
   - Create coding schema for semantic analysis
   - Design translation matrix structure
   - Define quantitative metrics

---

## CONCLUSION

This document collection strategy will yield a robust, high-quality corpus of **400+ Indian district court judgments** across **10 regional languages** on **5 critical legal concepts**. The systematic approach ensures:

- ✅ **Representative sampling** across linguistic families
- ✅ **Concept diversity** from procedural to substantive law
- ✅ **Temporal coverage** capturing legal evolution
- ✅ **Quality control** for deep semantic analysis
- ✅ **Ethical compliance** with open access principles

The resulting corpus will provide **unprecedented empirical evidence** for semantic gaps in multilingual legal systems, supporting the central thesis that certain English legal concepts are **structurally untranslatable** into regional Indian languages.
