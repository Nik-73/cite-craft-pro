# Analytical Framework & Coding Schema
## Systematic Semantic Gap Analysis for Indian Regional Language Legal Judgments

**Date**: 2025-11-17
**Research Phase**: Analysis Framework Development
**Purpose**: Standardized coding protocol for 400+ judgment analysis

---

## OVERVIEW

This analytical framework provides **systematic coding instructions** for extracting semantic gap evidence from Indian district court judgments. Each judgment will be coded across **6 analytical dimensions**:

1. **Lexical Analysis** - Translation patterns and terminology
2. **Semantic Structure Analysis** - Translation type classification
3. **Witness Testimony Analysis** - Colloquial to legal transformation
4. **Legal Reasoning Analysis** - Derivative vs. original reasoning
5. **Exception/Edge Case Analysis** - Semantic boundary testing
6. **Structural Indicators** - Markers of semantic difficulty

---

## JUDGMENT CODING TEMPLATE

### **METADATA SECTION**

```yaml
Judgment ID: [Unique identifier]
Case Title: [Full case name]
Court: [District Court name, State]
Case Number: [Case/CNR number]
Decision Date: [YYYY-MM-DD]
Judge(s): [Name(s)]
Language: [Primary language of judgment]
Language Percentage: [% regional vs English]
Length: [Page count / word count]
Primary Concept: [consent / dishonest_intention / reasonable_doubt / sexual_harassment / cruelty]
IPC Sections: [List]
Outcome: [Conviction / Acquittal / Decree granted / etc.]
```

---

## DIMENSION 1: LEXICAL ANALYSIS

### **Objective**: Map legal terminology translation patterns

### **Data to Extract**:

#### **1.1 Official Translation Check**

For each key legal term related to primary concept:

| English Legal Term | Official Statutory Translation | Court's Usage in Judgment | Witness/Colloquial Usage | Variation Within Judgment | Notes |
|-------------------|-------------------------------|---------------------------|-------------------------|--------------------------|-------|
| [e.g., "consent"] | [e.g., "सहमति" from IPC Hindi] | [Actual term(s) used] | [Terms in testimony] | [Yes/No + examples] | [Observations] |

**Instructions**:
1. Identify 5-10 key legal terms central to the concept
2. Check official translation in BNS/IPC/CrPC Hindi/regional translation
3. Extract ALL instances where term appears in judgment
4. Note variations, synonyms, compound phrases
5. Extract colloquial terms from witness statements

**Example for "Consent" in Hindi Judgment**:

| English Term | Official Translation | Court Usage | Witness Usage | Variation | Notes |
|--------------|---------------------|-------------|---------------|-----------|-------|
| Consent | सहमति (sahmati) | सहमति, राज़ी होना, इच्छा | "मैं राज़ी नहीं थी", "मैंने मना किया" | Yes - 3 different terms | Court uses official term in legal discussion, colloquial in facts |
| Free consent | स्वतंत्र सहमति | स्वेच्छा से सहमति, अपनी मर्ज़ी से | "अपनी मर्ज़ी से नहीं गई" | Yes | Court struggles with "free" - uses multiple elaborations |
| Without consent | बिना सहमति के | बिना सहमति के, ज़बरदस्ती, मनाही के बावजूद | "मैंने मना किया", "ज़ोर ज़बरदस्ती की" | Yes | Witness doesn't use "sahmati" - uses refusal language |

#### **1.2 Terminology Frequency Count**

Count occurrences of key terms:
- Official translation: [X times]
- Alternative regional terms: [Y times]
- English term used untranslated: [Z times]
- Compound/explanatory phrases: [N times]

**Calculation**:
- **Translation Consistency Score** = (Official translation uses) / (Total concept references) × 100

High score (>80%) = Stable translation
Medium score (50-80%) = Some variation
Low score (<50%) = High semantic instability

---

## DIMENSION 2: SEMANTIC STRUCTURE ANALYSIS

### **Objective**: Classify translation types for key legal terms

### **Classification System**:

**Type 1: Direct Equivalent**
- Single word in regional language
- Semantically equivalent to English concept
- No elaboration needed
- Boundaries identical

*Example*: "theft" → "चोरी" (chori) in Hindi
*Indicator*: Used without explanation, boundaries clear

**Type 2: Approximate Equivalent**
- Single word exists
- BUT semantic boundaries differ
- Requires occasional elaboration
- Cultural connotations vary

*Example*: "murder" → "हत्या" (hatya) - but does it distinguish intentional killing from other homicide?
*Indicator*: Court sometimes explains distinctions

**Type 3: Compound Translation**
- Multiple words required
- Each word partial
- Phrase captures concept better than single word
- May be standardized or variable

*Example*: "culpable homicide" → "आपराधिक मानव वध" (aaparadhik maanav vadh)
*Indicator*: Multi-word phrase consistently used

**Type 4: Explanatory Phrase**
- No single/compound translation sufficient
- Requires definitional explanation
- Court provides multi-sentence description
- Varies across judgments

*Example*: "reasonable doubt" → requires paragraph explaining concept
*Indicator*: Court doesn't rely on translation alone, explains concept

**Type 5: Untranslated English**
- English term used in regional script text
- No translation attempted or translation inadequate
- May appear in brackets after regional attempt

*Example*: "mens rea" often appears as "मेन्स रिया" or untranslated
*Indicator*: English word in devanagari/other script, or English in judgment

**Type 6: Neologism/Calque**
- New word created artificially
- Sounds foreign even in regional language
- Often modern crimes/concepts
- Not in common usage

*Example*: "stalking" → "स्टॉकिंग" (just English in Devanagari)
*Indicator*: Recent creation, unfamiliar to witness/lay persons

### **Coding Instructions**:

For each key legal term, assign classification:

```yaml
Term: [English legal term]
Translation: [Regional language term(s)]
Type: [1 / 2 / 3 / 4 / 5 / 6]
Confidence: [High / Medium / Low]
Evidence: [Quote from judgment showing type]
Notes: [Additional observations]
```

**Example Coding**:

```yaml
Term: "consent"
Translation: "सहमति" (sahmati)
Type: 2 (Approximate Equivalent)
Confidence: High
Evidence: "Court uses 'sahmati' but then explains 'स्वेच्छा से दी गई सहमति जो बिना किसी दबाव, भय या प्रलोभन के हो' (consent freely given without pressure, fear, or inducement)"
Notes: Single word exists but court feels need to elaborate on "free" aspect - suggests semantic boundaries not identical
```

### **Semantic Density Measurement**:

Count words needed to express concept:

- English: [X words] (from statutory definition)
- Regional language: [Y words] (from court's explanation)
- **Density Ratio**: Y/X

**Hypothesis**: Ratio > 1.5 indicates semantic gap (concept doesn't fit cleanly into regional language)

Example:
- "Beyond reasonable doubt" (English): 3 words
- Hindi court explanation: "ऐसा संदेह जो एक विवेकशील और सामान्य बुद्धि के व्यक्ति के मन में उत्पन्न हो और जिसके कारण वह निर्णय लेने में संकोच करे" (Such doubt that arises in the mind of a rational and ordinarily prudent person causing hesitation in decision-making): 22 words
- **Density Ratio**: 22/3 = 7.33 → **High semantic gap**

---

## DIMENSION 3: WITNESS TESTIMONY ANALYSIS

### **Objective**: Track semantic transformation from colloquial to legal language

### **Data to Extract**:

For each relevant witness statement:

```yaml
Witness ID: [PW-1, PW-2, etc.]
Witness Type: [Victim / Accused / Eye-witness / Expert]
Original Statement: |
  [Extract in regional language]
Literal English Translation: |
  [Word-for-word translation]
Legal Categorization: [How court classifies this under statute]
Semantic Transformation:
  Added: [Concepts introduced by court that weren't in testimony]
  Lost: [Nuances in testimony not captured in legal categorization]
  Changed: [Meaning shifts]
Court Acknowledgment: [Yes/No - Does court discuss translation/interpretation?]
```

### **Key Questions to Answer**:

1. **What verbs/descriptors do witnesses use?**
   - List verbs for action (e.g., "ज़ोर ज़बरदस्ती की" vs. legal "बिना सहमति के")
   - List descriptors for mental state (e.g., "मैं डर गई" vs. legal "भय के कारण सहमति नहीं दी")

2. **What cultural/contextual terms appear?**
   - Honor terms ("इज़्ज़त", "मान-सम्मान")
   - Family terms ("पत्नी का धर्म", "सेवा करना")
   - Religious terms ("पाप", "धर्म")
   - Caste terms (if relevant)

3. **How does court translate witness language into legal categories?**
   - Direct mapping: Witness word → Legal term (e.g., "मना किया" → "सहमति नहीं दी")
   - Interpretive: Court infers legal concept from description

4. **Is there semantic loss or semantic addition?**
   - **Loss**: Witness describes complex emotional state → Court reduces to binary legal category
   - **Addition**: Court adds legal concepts not expressed by witness (e.g., "free and voluntary" when witness just said "no")

5. **Does court acknowledge translation/interpretation?**
   - Phrases like "साक्षी के बयान से स्पष्ट है कि..." (From witness statement it is clear that...)
   - Explicit acknowledgment of language gap: "साक्षी ने अपने शब्दों में कहा..." (Witness said in their own words...)

### **Examples**:

**Example 1: Consent in Sexual Assault Case**

```yaml
Witness ID: PW-1 (Complainant)
Witness Type: Victim
Original Statement: |
  "मैंने उसे बार-बार मना किया। मैं डर गई थी। उसने मेरी बात नहीं सुनी। मैं नहीं चाहती थी कि ऐसा हो।"
  (I refused him repeatedly. I became scared. He didn't listen. I didn't want this to happen.)
Literal English Translation: |
  "I refused him repeatedly. I became scared. He didn't listen. I didn't want this to happen."
Legal Categorization: "पीड़िता ने स्पष्ट रूप से अपनी सहमति नहीं दी। भय के कारण उसकी सहमति नहीं मानी जा सकती।"
  (Victim clearly did not give consent. Due to fear, her consent cannot be considered.)
Semantic Transformation:
  Added: Formal concept of "सहमति" (consent) - witness used "मना किया" (refused), "नहीं चाहती थी" (didn't want)
  Lost: Emotional complexity - fear, repeated refusal, being unheard
  Changed: Active refusal ("मना किया") → Passive lack of consent ("सहमति नहीं दी")
Court Acknowledgment: Partial - Court says "साक्षी के बयान से स्पष्ट है" but doesn't discuss terminological difference
```

**Example 2: Dishonest Intention in Theft Case**

```yaml
Witness ID: Accused's Statement
Witness Type: Accused
Original Statement: |
  "मैंने सोचा था कि मैं कुछ दिन बाद वापस कर दूंगा। मुझे पैसों की ज़रूरत थी। मैंने चोरी नहीं की, मैंने उधार लिया।"
  (I thought I would return it after some days. I needed money. I didn't steal, I borrowed.)
Literal English Translation: |
  "I thought I would return it after some days. I needed money. I didn't steal, I borrowed."
Legal Categorization: "आरोपी का यह कहना कि वह संपत्ति वापस करेगा, उसके बेईमान इरादे को नहीं मिटाता। लेने के समय वापसी का इरादा होना चाहिए।"
  (Accused's claim of returning property doesn't negate dishonest intention. Intention to return must exist at time of taking.)
Semantic Transformation:
  Added: Legal concept "बेईमान इरादा" (dishonest intention), temporal element "लेने के समय" (at time of taking)
  Lost: Accused's subjective understanding of "borrowing" vs "stealing"
  Changed: Accused's "उधार लिया" (borrowed) → Court's "बेईमान इरादे से लिया" (took with dishonest intention)
Court Acknowledgment: Yes - Court explicitly addresses accused's characterization vs legal reality
```

---

## DIMENSION 4: LEGAL REASONING ANALYSIS

### **Objective**: Classify reasoning as derivative, hybrid, or original

### **Coding Schema**:

#### **A. Reasoning Language Assessment**

Is legal analysis conducted in regional language or translated from English?

- [ ] **Fully Regional**: No English precedents, reasons in regional language concepts
- [ ] **Code-Switching**: Regional language + frequent English legal terms/phrases
- [ ] **Translated English**: Appears to reason in English, reports in regional language

**Indicators of Translated English**:
- Phrases like "दूसरे शब्दों में" (in other words), "अर्थात" (that is to say)
- Awkward syntax matching English structure
- Legal tests stated in English then "explained" in regional language

#### **B. Precedent Integration**

How are English-language precedents cited and used?

```yaml
Precedent Cases Cited: [Count]
Supreme Court Cases: [Count]
High Court Cases: [Count]
English/Foreign Cases: [Count]

Citation Pattern:
  - [ ] Quoted in English, no translation
  - [ ] Quoted in English, translation provided
  - [ ] Only translation provided
  - [ ] Cited for authority, not reasoning

Ratio Decidendi:
  - [ ] Quoted in English
  - [ ] Translated into regional language
  - [ ] Explained/elaborated in regional language
  - [ ] Applied without explanation (assumes understanding)
```

**Example Coding**:

```yaml
Case: State v. XYZ, District Court Lucknow (Hindi)
Precedents Cited: 12
  Supreme Court: 10
  High Court: 2

Citation Pattern:
  - All 12 cited in English with case name + citation
  - 3 have key holdings translated
  - 9 cited without translation

Ratio Decidendi Usage:
  - "Hon'ble Supreme Court ने State of Punjab v. Gurmit Singh (1996) में कहा है कि 'consent means an act of reason accompanied by deliberation'..."
  - English quote embedded in Hindi text
  - No translation of English quote provided
  - Court proceeds to apply test without explaining in Hindi

Assessment: Heavy precedent dependence, assumes reader understands English legal reasoning
```

#### **C. Conceptual Framework Analysis**

Does court reason through regional language concepts or English framework?

**Classification**:

**DERIVATIVE REASONING** (Score: 0-33)
- Applies English precedent directly
- Translates English legal test into regional language
- No independent conceptual analysis
- Regional language is reporting medium only

*Indicators*:
- "Hon'ble Supreme Court has held that..."
- Direct application of English-language test
- No regional language conceptual analogs
- Citation-heavy, analysis-light

**HYBRID REASONING** (Score: 34-66)
- Uses English legal framework
- But employs regional language examples, analogies, cultural context
- Some independent analysis within English framework
- Regional language adds context/explanation

*Indicators*:
- English legal test + regional cultural application
- Uses regional proverbs, analogies to explain
- Considers cultural factors in interpretation
- Partial independence but framework remains English

**ORIGINAL REASONING** (Score: 67-100)
- Reasons through regional language concepts independently
- May cite English precedent for authority but develops reasoning independently
- Uses regional philosophical/cultural legal concepts
- Could have reached conclusion without English precedent

*Indicators*:
- Minimal English precedent citation
- Develops legal test from regional language concepts
- Uses indigenous legal philosophy (dharma, nyaya, etc.)
- Reasoning is self-contained

### **Coding Template**:

```yaml
Reasoning Classification: [Derivative / Hybrid / Original]
Score: [0-100]
Confidence: [High / Medium / Low]

Evidence:
  Precedent Dependency: [Heavy / Moderate / Light / None]
  English Legal Terms: [Frequent / Occasional / Rare / None]
  Regional Concepts Used: [None / Few / Many / Central]
  Independent Analysis: [None / Minimal / Moderate / Extensive]

Key Passages:
  - Quote 1: |
      [Passage showing reasoning pattern]
    Analysis: [Why this evidences classification]

  - Quote 2: |
      [Another passage]
    Analysis: [Analysis]

Overall Assessment: |
  [Detailed explanation of classification with specific evidence]
```

**Example**:

```yaml
Reasoning Classification: Derivative
Score: 15
Confidence: High

Evidence:
  Precedent Dependency: Heavy (12 Supreme Court cases cited, reasoning follows precedent structure)
  English Legal Terms: Frequent ("consent means act of reason", "free and voluntary consent", etc. appear untranslated)
  Regional Concepts Used: None (no dharma, nyaya, or cultural concepts invoked)
  Independent Analysis: None (entire reasoning is application of SC precedents)

Key Passages:
  - Quote 1: |
      "Hon'ble Supreme Court ने Rao Harnarain Singh Sheoji Singh v. State (1958) में स्पष्ट किया है कि 'consent' एक reasoned act होनी चाहिए जो deliberation के साथ हो। इस मामले में पीड़िता ने कोई consent नहीं दिया..."
      (Hon'ble Supreme Court clarified in Rao Harnarain Singh that 'consent' must be a reasoned act with deliberation. In this case victim gave no consent...)
    Analysis: Court quotes English precedent in English, embeds in Hindi sentence structure. Applies test without developing meaning of "reasoned" or "deliberation" in Hindi conceptual framework.

  - Quote 2: |
      "Consent के लिए यह आवश्यक है कि यह free और voluntary हो। 'Free consent' का अर्थ है कि कोई fear, force या fraud न हो।"
      (For consent it is necessary that it be free and voluntary. 'Free consent' means there is no fear, force or fraud.)
    Analysis: Uses English legal terms "free", "voluntary", "fear", "force", "fraud" - these are directly from Indian Contract Act English version. No independent regional language conceptualization.

Overall Assessment: |
  This judgment exemplifies derivative reasoning. The entire conceptual framework is borrowed from English-language Supreme Court precedents. The Hindi language serves merely as a reporting medium. Legal tests are stated in English or directly translated. No attempt to develop meaning of "consent" from Hindi/Indian philosophical concepts. Court could not have reasoned to this conclusion without English precedent - there is no independent legal development in Hindi.
```

---

## DIMENSION 5: EXCEPTION/EDGE CASE ANALYSIS

### **Objective**: Test semantic boundaries through difficult cases

### **Focus Areas**:

#### **A. Defenses and Exceptions**

When court must apply defenses/exceptions, semantic precision becomes critical:

**For Consent Cases**:
- Provocation defense
- Consent obtained by misconception
- Consent by person of unsound mind
- Consent by intoxicated person

**For Dishonest Intention Cases**:
- Claim of right
- Mistake of fact vs. mistake of law
- Temporary vs. permanent deprivation

**For Reasonable Doubt Cases**:
- Suspicious circumstances vs. reasonable doubt
- Benefit of doubt vs. doubt in prosecution case

### **Coding Template**:

```yaml
Exception/Defense Involved: [Name]
Court's Articulation: |
  [How court states the legal test in regional language]

Semantic Struggle Indicators:
  - [ ] Multiple attempts to define
  - [ ] Elaborate explanation (>100 words for simple concept)
  - [ ] Cites English precedent for definition
  - [ ] Uses multiple synonyms/alternatives
  - [ ] Acknowledges difficulty in expression

Cultural Context Considered: [Yes / No / Partially]
If Yes, Details: |
  [How cultural factors influenced interpretation]

Semantic Framework Influence: [Evidence that regional language semantics affected legal interpretation]

Boundary Clarity: [Clear / Somewhat Clear / Unclear]
Evidence: |
  [Why boundary is/isn't clear in regional language]
```

#### **B. Novel Fact Patterns**

Modern/unusual cases test whether regional language can generate new legal reasoning:

**Examples**:
- Social media sexual harassment
- Consent in long-term relationship context
- Cyber fraud (dishonest intention in digital context)
- DNA evidence and reasonable doubt

**Coding Focus**:
- Does court develop new terminology?
- Does court apply old framework or create new analysis?
- Is reasoning derivative (from English precedent on similar new issue) or original?

---

## DIMENSION 6: STRUCTURAL INDICATORS OF SEMANTIC DIFFICULTY

### **Objective**: Identify textual markers of semantic struggle

### **Indicator Checklist**:

#### **6.1 Repetition/Redundancy**

- [ ] Multiple terms for same concept (suggests no single equivalent)
  - Count: [X terms for concept Y]
  - Terms: [List]

- [ ] Explanatory phrases after technical terms
  - Example: "सहमति अर्थात स्वतंत्र इच्छा..." (consent meaning free will...)

- [ ] "That is to say" constructions
  - Hindi: "अर्थात", "दूसरे शब्दों में", "यानी कि"
  - Tamil: "அதாவது", "வேறு வார்த்தைகளில்"
  - Count: [X occurrences]

#### **6.2 Elaboration**

- [ ] Long explanations of simple terms
  - Term: [X]
  - Explanation length: [Y words]
  - Standard definition: [Z words]
  - Ratio: Y/Z = [Ratio]

- [ ] Breaking down compound concepts into components
  - Example: "Free and voluntary consent" → "स्वतंत्र" + "स्वेच्छा से" + "सहमति" each explained separately

- [ ] Providing examples when definition should suffice
  - Count: [X examples provided]
  - Necessity: [Necessary / Unnecessary]

#### **6.3 Hedging/Uncertainty**

- [ ] "What we might call" phrases
  - Hindi: "जिसे हम कह सकते हैं", "जो कि मानी जा सकती है"
  - Count: [X]

- [ ] "Roughly speaking" qualifiers
  - Hindi: "लगभग", "सामान्यतः", "आमतौर पर"
  - Count: [X]

- [ ] Multiple alternative translations offered
  - Example: "सहमति या राज़ी होना या स्वेच्छा से इच्छा..."
  - Count: [X instances]

- [ ] Definitional debates within judgment
  - Example: Court discusses what "consent" means, cites multiple authorities, settles on definition
  - Present: [Yes / No]

#### **6.4 Code-Switching**

- [ ] English terms in brackets after regional term
  - Count: [X occurrences]
  - Terms: [List]

- [ ] English phrases in otherwise regional language text
  - Count: [X occurrences]
  - Phrases: [List]

- [ ] Sudden switch to English for technical analysis
  - Identified: [Yes / No]
  - Passages: [Line numbers or quotes]

#### **6.5 Meta-Commentary**

- [ ] Court acknowledging translation difficulty
  - Quotes: [Extract relevant passages]

- [ ] Explicit discussion of terminology choices
  - Example: "हालांकि 'सहमति' शब्द का प्रयोग किया गया है, लेकिन इसका अर्थ..." (Although the word 'consent' is used, its meaning...)

- [ ] Reference to English concept as authoritative
  - Example: "'Consent' जैसा कि अंग्रेज़ी में समझा जाता है..." (Consent as understood in English...)

### **Structural Difficulty Score**:

Calculate composite score:

```
Repetition Score = (Multiple terms × 2) + (Explanatory phrases × 1)
Elaboration Score = (Avg explanation ratio - 1) × 10
Hedging Score = (Hedging phrases / Total paragraphs) × 100
Code-Switching Score = (English terms / Total legal terms) × 100
Meta-Commentary Score = Presence (Yes=10, Partial=5, No=0)

TOTAL STRUCTURAL DIFFICULTY SCORE = Sum of above / 5
```

**Interpretation**:
- 0-20: Low semantic difficulty (concept fits well)
- 21-40: Moderate difficulty (some struggle, manageable)
- 41-60: High difficulty (significant semantic gaps)
- 61-100: Extreme difficulty (concept highly problematic)

---

## DATA AGGREGATION & CROSS-JUDGMENT ANALYSIS

### **Master Translation Matrix**

Aggregate all translations across judgments:

| Legal Concept | Language | Standard Translation | Variations (frequency) | Type 1-6 Distribution | Avg Density Ratio |
|---------------|----------|---------------------|----------------------|---------------------|------------------|
| Consent | Hindi | सहमति (45) | राज़ी होना (12), इच्छा (8), अनुमति (3) | Type 2: 80%, Type 3: 15%, Type 4: 5% | 2.1 |
| Consent | Tamil | சம்மதம் (18) | இணக்கம் (5), விருப்பம் (2) | Type 2: 70%, Type 3: 20%, Type 4: 10% | 2.4 |
| ... | ... | ... | ... | ... | ... |

### **Reasoning Pattern Distribution**

Aggregate reasoning classifications:

| Concept | Language | Derivative % | Hybrid % | Original % | Avg Score |
|---------|----------|--------------|----------|------------|-----------|
| Consent | Hindi | 72% | 25% | 3% | 18 |
| Consent | Tamil | 80% | 15% | 5% | 14 |
| ... | ... | ... | ... | ... | ... |

### **Witness Testimony Transformation Patterns**

Aggregate semantic transformations:

| Concept | Language | Common Colloquial Terms | Common Legal Terms | Typical Additions | Typical Losses |
|---------|----------|------------------------|-------------------|------------------|----------------|
| Consent | Hindi | मना किया, नहीं चाहती थी, ज़बरदस्ती की | सहमति नहीं दी, स्वतंत्र सहमति नहीं थी | "Free and voluntary", temporal precision | Emotional complexity, context |
| ... | ... | ... | ... | ... | ... |

---

## QUALITY CONTROL

### **Inter-Coder Reliability**:

For subset of judgments (20%), have second coder analyze:
- Calculate Cohen's Kappa for categorical variables (Translation Type, Reasoning Classification)
- Calculate correlation for continuous variables (Density Ratio, Structural Difficulty Score)
- Target: κ > 0.70 for acceptable reliability

### **Validation Checks**:

- [ ] Every judgment has complete metadata
- [ ] All key terms coded for translation type
- [ ] At least 3 witness testimony excerpts analyzed (if applicable)
- [ ] Reasoning classification has supporting evidence
- [ ] Structural indicators quantified
- [ ] Notes field documents unusual patterns

---

## OUTPUT FILES PER JUDGMENT

For each judgment, produce:

1. **[JudgmentID]_coding_sheet.yaml** - Structured data
2. **[JudgmentID]_analysis_memo.md** - Detailed qualitative analysis
3. **[JudgmentID]_excerpts.txt** - Key passages with annotations

---

## TIMELINE

- **Weeks 10-14**: Code 100 Consent judgments (primary concept)
- **Weeks 14-16**: Code 75 Dishonest Intention judgments
- **Weeks 16-18**: Code 75 Reasonable Doubt judgments
- **Weeks 18-19**: Code 50 Sexual Harassment judgments
- **Weeks 19-20**: Code 50 Cruelty judgments
- **Week 20**: Data aggregation and quality control

---

## NEXT STEPS

1. ✅ **Analytical Framework Complete**
2. ⏭️ **Train Coders** (if team) or **Begin Pilot Coding** (if solo)
   - Select 10 judgments across concepts/languages
   - Apply framework
   - Refine based on pilot experience
3. ⏭️ **Build Technical Tools**
   - Automated metadata extraction
   - Term frequency counters
   - Translation matrix builders
4. ⏭️ **Systematic Coding of Full Corpus**

---

## CONCLUSION

This analytical framework provides **systematic, replicable coding** procedures for extracting **Tier 1-4 evidence** of semantic gaps:

- **Tier 1 (Lexical)**: Translation type classification, terminology mapping
- **Tier 2 (Structural)**: Density ratios, structural difficulty indicators
- **Tier 3 (Reasoning)**: Derivative vs. original classification, precedent dependency
- **Tier 4 (Outcome)**: Edge case analysis, cultural semantic interference

The framework ensures:
- ✅ **Consistency**: Standardized coding across 400+ judgments
- ✅ **Rigor**: Quantitative metrics + qualitative depth
- ✅ **Replicability**: Clear procedures, inter-coder reliability checks
- ✅ **Validity**: Multiple evidence types converge on thesis

Application of this framework will generate **empirical evidence** demonstrating that certain English legal concepts are **structurally untranslatable** into Indian regional languages, preventing indigenous legal development.
