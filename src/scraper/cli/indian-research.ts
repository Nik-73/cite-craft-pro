#!/usr/bin/env node

/**
 * CLI Tool for Indian Regional Language Legal Semantic Gap Research
 *
 * This tool facilitates systematic collection of Indian district court judgments
 * for analyzing semantic gaps between English and regional language legal reasoning.
 *
 * Usage:
 *   npm run research:collect -- --concept consent --language hi --limit 30
 *   npm run research:collect -- --concept dishonest_intention --language ta --court "Madras High Court"
 *   npm run research:export -- --concept consent --format json
 */

import { Command } from 'commander';
import { IndianKanoonScraper } from '../sources/IndianKanoonScraper.js';
import {
  IndianLegalSearchOptions,
  LegalConcept,
  IPC_SECTIONS_BY_CONCEPT,
  INDIAN_LANGUAGES,
  STATE_LANGUAGES,
} from '../types/indian-legal.js';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

// ===== CONFIGURATION =====

const RESEARCH_DATA_DIR = path.join(process.cwd(), 'data', 'judgments');

const CONCEPT_KEYWORDS: Record<LegalConcept, Record<string, string[]>> = {
  consent: {
    hi: ['सहमति', 'राज़ी', 'बिना सहमति', 'ज़बरदस्ती', 'स्वतंत्र सहमति'],
    ta: ['சம்மதம்', 'சம்மதமின்றி', 'வற்புறுத்தல்', 'இணக்கம்'],
    te: ['సమ్మతి', 'సమ్మతి లేకుండా', 'బలవంతం', 'ఒప్పందం'],
    bn: ['সম্মতি', 'সম্মতি ছাড়া', 'জোরপূর্বক', 'ইচ্ছা'],
    mr: ['संमती', 'संमतीशिवाय', 'जबरदस्ती', 'इच्छा'],
    kn: ['ಒಪ್ಪಿಗೆ', 'ಒಪ್ಪಿಗೆ ಇಲ್ಲದೆ', 'ಬಲವಂತ'],
    ml: ['സമ്മതം', 'സമ്മതം കൂടാതെ', 'ബലപ്രയോഗം'],
    gu: ['સંમતિ', 'સંમતિ વગર', 'બળજબરી'],
    pa: ['ਸਹਿਮਤੀ', 'ਸਹਿਮਤੀ ਬਿਨਾਂ', 'ਜ਼ਬਰਦਸਤੀ'],
    or: ['ସମ୍ମତି', 'ସମ୍ମତି ବିନା', 'ବଳପୂର୍ବକ'],
    en: ['consent', 'without consent', 'free consent', 'voluntary'],
  },
  dishonest_intention: {
    hi: ['बेईमानी का इरादा', 'धोखाधड़ी', 'कपटपूर्ण इरादा', 'ठगी'],
    ta: ['நேர்மையற்ற நோக்கம்', 'மோசடி', 'ஏமாற்றுதல்'],
    te: ['నిజాయితీ లేని ఉద్దేశం', 'మోసం', 'మోసపూరిత ఉద్దేశం'],
    bn: ['অসাধু উদ্দেশ্য', 'প্রতারণা', 'ঠগবাজি'],
    mr: ['अप्रामाणिक हेतू', 'फसवणूक', 'कपट'],
    kn: ['ಅಪ್ರಾಮಾಣಿಕ ಉದ್ದೇಶ', 'ವಂಚನೆ'],
    ml: ['സത്യസന്ധതയില്ലാത്ത ഉദ്ദേശം', 'വഞ്ചന'],
    gu: ['બેપ્રમાણિક ઇરાદો', 'છેતરપિંડી'],
    pa: ['ਬੇਈਮਾਨੀ ਦਾ ਇਰਾਦਾ', 'ਧੋਖਾ'],
    or: ['ଅସାଧୁ ଉଦ୍ଦେଶ୍ୟ', 'ପ୍ରତାରଣା'],
    en: ['dishonest intention', 'fraudulent', 'cheating', 'deception'],
  },
  reasonable_doubt: {
    hi: ['उचित संदेह', 'युक्तियुक्त संदेह', 'संदेह से परे', 'संदेह का लाभ'],
    ta: ['நியாயமான சந்தேகம்', 'சந்தேகத்திற்கு அப்பால்', 'சந்தேக நன்மை'],
    te: ['సహేతుకమైన సందేహం', 'సందేహానికి అతీతంగా'],
    bn: ['যুক্তিসঙ্গত সন্দেহ', 'সন্দেহের ঊর্ধ্বে'],
    mr: ['वाजवी शंका', 'शंकेच्या पलीकडे'],
    kn: ['ಸಮಂಜಸವಾದ ಸಂಶಯ', 'ಸಂಶಯಕ್ಕೆ ಅತೀತವಾಗಿ'],
    ml: ['ന്യായമായ സംശയം', 'സംശയത്തിനതീതം'],
    gu: ['વાજબી શંકા', 'શંકાથી આગળ'],
    pa: ['ਵਾਜਬ ਸ਼ੱਕ', 'ਸ਼ੱਕ ਤੋਂ ਪਰੇ'],
    or: ['ଯୁକ୍ତିଯୁକ୍ତ ସନ୍ଦେହ', 'ସନ୍ଦେହ ବାହାରେ'],
    en: ['reasonable doubt', 'beyond reasonable doubt', 'benefit of doubt'],
  },
  sexual_harassment: {
    hi: ['यौन उत्पीड़न', 'यौन शोषण', 'अवांछित यौन प्रगति'],
    ta: ['பாலியல் துன்புறுத்தல்', 'பாலியல் தொல்லை'],
    te: ['లైంగిక వేధింపు', 'లైంగిక వేధింపు'],
    bn: ['যৌন হয়রানি', 'যৌন নির্যাতন'],
    mr: ['लैंगिक छळ', 'लैंगिक त्रास'],
    kn: ['ಲೈಂಗಿಕ ಕಿರುಕುಳ', 'ಲೈಂಗಿಕ ಕಿರುಕುಳ'],
    ml: ['ലൈംഗിക പീഡനം', 'ലൈംഗികാതിക്രമം'],
    gu: ['જાતીય સતામણી', 'જાતીય હેરાનગતિ'],
    pa: ['ਜਿਨਸੀ ਪਰੇਸ਼ਾਨੀ', 'ਜਿਨਸੀ ਸ਼ੋਸ਼ਣ'],
    or: ['ଯୌନ ନିର୍ଯ୍ୟାତନା', 'ଯୌନ ନିର୍ଯ୍ୟାତନା'],
    en: ['sexual harassment', 'unwelcome sexual advances', 'hostile environment'],
  },
  cruelty: {
    hi: ['क्रूरता', 'मानसिक क्रूरता', 'शारीरिक क्रूरता', 'उत्पीड़न'],
    ta: ['கொடூரம்', 'மனரீதியான கொடூரம்'],
    te: ['క్రూరత్వం', 'మానసిక క్రూరత్వం'],
    bn: ['নিষ্ঠুরতা', 'মানসিক নিষ্ঠুরতা'],
    mr: ['क्रूरता', 'मानसिक क्रूरता'],
    kn: ['ಕ್ರೂರತೆ', 'ಮಾನಸಿಕ ಕ್ರೂರತೆ'],
    ml: ['ക്രൂരത', 'മാനസിക ക്രൂരത'],
    gu: ['ક્રૂરતા', 'માનસિક ક્રૂરતા'],
    pa: ['ਬੇਰਹਿਮੀ', 'ਮਾਨਸਿਕ ਬੇਰਹਿਮੀ'],
    or: ['ନିଷ୍ଠୁରତା', 'ମାନସିକ ନିଷ୍ଠୁରତା'],
    en: ['cruelty', 'mental cruelty', 'physical cruelty', 'harassment'],
  },
  // Add other concepts as needed
  provocation: { en: ['provocation', 'grave and sudden provocation'] },
  self_defense: { en: ['self-defense', 'private defense', 'right of private defense'] },
  negligence: { en: ['negligence', 'rash and negligent act'] },
  malice: { en: ['malice', 'malice aforethought', 'ill-will'] },
  fraud: { en: ['fraud', 'fraudulent', 'misrepresentation'] },
  coercion: { en: ['coercion', 'duress', 'force'] },
  undue_influence: { en: ['undue influence', 'unfair advantage'] },
  mens_rea: { en: ['mens rea', 'guilty mind', 'criminal intent'] },
  actus_reus: { en: ['actus reus', 'guilty act', 'criminal act'] },
};

// ===== COMMANDS =====

program
  .name('indian-research')
  .description('CLI tool for collecting Indian legal judgments for semantic gap research')
  .version('1.0.0');

/**
 * Collect command - Search and download judgments
 */
program
  .command('collect')
  .description('Collect judgments for a specific legal concept and language')
  .requiredOption('-c, --concept <concept>', 'Legal concept (consent, dishonest_intention, reasonable_doubt, sexual_harassment, cruelty)')
  .option('-l, --language <language>', 'Language code (hi, ta, te, bn, mr, kn, ml, gu, pa, or)', 'hi')
  .option('-n, --limit <number>', 'Number of judgments to collect', '20')
  .option('--court <court>', 'Filter by court name')
  .option('--from <date>', 'From date (YYYY-MM-DD)', '2015-01-01')
  .option('--to <date>', 'To date (YYYY-MM-DD)', new Date().toISOString().split('T')[0])
  .option('--court-level <level>', 'Court level (District Court, Sessions Court, High Court)', 'District Court')
  .option('--min-length <words>', 'Minimum word count', '1000')
  .option('--require-testimony', 'Only include judgments with witness testimony', false)
  .action(async (options) => {
    try {
      console.log('\n🔍 Indian Legal Research Collection Tool\n');
      console.log(`Concept: ${options.concept}`);
      console.log(`Language: ${INDIAN_LANGUAGES[options.language as keyof typeof INDIAN_LANGUAGES] || options.language}`);
      console.log(`Limit: ${options.limit}`);
      console.log(`Date Range: ${options.from} to ${options.to}\n`);

      const scraper = new IndianKanoonScraper();
      const concept = options.concept as LegalConcept;

      // Build search query
      const keywords = CONCEPT_KEYWORDS[concept]?.[options.language] || [];
      const ipcSections = IPC_SECTIONS_BY_CONCEPT[concept] || [];

      const searchOptions: IndianLegalSearchOptions = {
        query: keywords.join(' OR '),
        language: options.language,
        courtLevel: options.courtLevel,
        court: options.court,
        fromDate: options.from,
        toDate: options.to,
        ipcSection: ipcSections,
        limit: parseInt(options.limit),
        minLength: parseInt(options.minLength || '1000'),
        requireWitnessTestimony: options.requireTestimony,
        primaryConcept: concept,
      };

      console.log('🌐 Searching IndianKanoon...\n');
      const results = await scraper.searchIndian(searchOptions);

      console.log(`✅ Found ${results.length} judgments\n`);

      // Create directory structure
      const conceptDir = path.join(RESEARCH_DATA_DIR, concept, options.language);
      fs.mkdirSync(conceptDir, { recursive: true });

      // Save results
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const filename = `judgment_${String(i + 1).padStart(3, '0')}.json`;
        const filepath = path.join(conceptDir, filename);

        fs.writeFileSync(filepath, JSON.stringify(result, null, 2));

        console.log(`📄 Saved: ${filename}`);
        console.log(`   Title: ${result.title.substring(0, 80)}...`);
        console.log(`   Court: ${result.metadata?.court}`);
        console.log(`   Date: ${result.date}`);
        console.log(`   Words: ${result.content.split(/\s+/).length}`);
        console.log(`   Language: ${result.metadata?.language} (${result.metadata?.languagePercentage}%)`);
        console.log(`   Testimony: ${result.metadata?.hasWitnessTestimony ? 'Yes' : 'No'}\n`);
      }

      // Save summary
      const summary = {
        concept,
        language: options.language,
        totalJudgments: results.length,
        dateRange: { from: options.from, to: options.to },
        collectedAt: new Date().toISOString(),
        judgments: results.map(r => ({
          id: r.id,
          title: r.title,
          court: r.metadata?.court,
          date: r.date,
          url: r.url,
          wordCount: r.content.split(/\s+/).length,
        })),
      };

      const summaryPath = path.join(conceptDir, 'collection_summary.json');
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

      console.log(`\n✅ Collection complete!`);
      console.log(`📁 Data saved to: ${conceptDir}`);
      console.log(`📊 Summary: ${summaryPath}\n`);
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * List command - Show collection status
 */
program
  .command('list')
  .description('List collected judgments')
  .option('-c, --concept <concept>', 'Filter by concept')
  .option('-l, --language <language>', 'Filter by language')
  .action((options) => {
    try {
      if (!fs.existsSync(RESEARCH_DATA_DIR)) {
        console.log('\n📂 No judgments collected yet.\n');
        return;
      }

      console.log('\n📚 Collected Judgments\n');

      const concepts = options.concept
        ? [options.concept]
        : fs.readdirSync(RESEARCH_DATA_DIR);

      let totalJudgments = 0;

      for (const concept of concepts) {
        const conceptPath = path.join(RESEARCH_DATA_DIR, concept);
        if (!fs.existsSync(conceptPath)) continue;

        const languages = options.language
          ? [options.language]
          : fs.readdirSync(conceptPath);

        for (const lang of languages) {
          const langPath = path.join(conceptPath, lang);
          if (!fs.existsSync(langPath)) continue;

          const files = fs.readdirSync(langPath).filter(f => f.startsWith('judgment_'));
          totalJudgments += files.length;

          console.log(`${concept} / ${lang}: ${files.length} judgments`);

          // Read summary if exists
          const summaryPath = path.join(langPath, 'collection_summary.json');
          if (fs.existsSync(summaryPath)) {
            const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
            console.log(`  Collected: ${summary.collectedAt}`);
            console.log(`  Date Range: ${summary.dateRange.from} to ${summary.dateRange.to}`);
          }
          console.log();
        }
      }

      console.log(`Total: ${totalJudgments} judgments\n`);
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Export command - Export collection for analysis
 */
program
  .command('export')
  .description('Export collected judgments for analysis')
  .option('-c, --concept <concept>', 'Filter by concept')
  .option('-l, --language <language>', 'Filter by language')
  .option('-f, --format <format>', 'Export format (json, csv)', 'json')
  .option('-o, --output <file>', 'Output file', 'export.json')
  .action((options) => {
    try {
      console.log('\n📤 Exporting collected judgments...\n');

      const allJudgments: any[] = [];

      if (!fs.existsSync(RESEARCH_DATA_DIR)) {
        console.log('❌ No data to export\n');
        return;
      }

      const concepts = options.concept
        ? [options.concept]
        : fs.readdirSync(RESEARCH_DATA_DIR);

      for (const concept of concepts) {
        const conceptPath = path.join(RESEARCH_DATA_DIR, concept);
        if (!fs.existsSync(conceptPath)) continue;

        const languages = options.language
          ? [options.language]
          : fs.readdirSync(conceptPath);

        for (const lang of languages) {
          const langPath = path.join(conceptPath, lang);
          if (!fs.existsSync(langPath)) continue;

          const files = fs.readdirSync(langPath).filter(f => f.startsWith('judgment_'));

          for (const file of files) {
            const filepath = path.join(langPath, file);
            const judgment = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
            allJudgments.push({
              concept,
              language: lang,
              ...judgment,
            });
          }
        }
      }

      // Export based on format
      if (options.format === 'json') {
        fs.writeFileSync(options.output, JSON.stringify(allJudgments, null, 2));
      } else if (options.format === 'csv') {
        // Simple CSV export (can be enhanced)
        const csv = [
          'Concept,Language,Title,Court,Date,URL,WordCount',
          ...allJudgments.map(j =>
            `"${j.concept}","${j.language}","${j.title}","${j.metadata?.court}","${j.date}","${j.url}",${j.content.split(/\s+/).length}`
          ),
        ].join('\n');
        fs.writeFileSync(options.output, csv);
      }

      console.log(`✅ Exported ${allJudgments.length} judgments to ${options.output}\n`);
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Stats command - Show collection statistics
 */
program
  .command('stats')
  .description('Show collection statistics')
  .action(() => {
    try {
      if (!fs.existsSync(RESEARCH_DATA_DIR)) {
        console.log('\n📂 No judgments collected yet.\n');
        return;
      }

      console.log('\n📊 Collection Statistics\n');

      const stats: any = {
        byConcept: {},
        byLanguage: {},
        byCourt: {},
        total: 0,
      };

      const concepts = fs.readdirSync(RESEARCH_DATA_DIR);

      for (const concept of concepts) {
        const conceptPath = path.join(RESEARCH_DATA_DIR, concept);
        if (!fs.statSync(conceptPath).isDirectory()) continue;

        stats.byConcept[concept] = 0;

        const languages = fs.readdirSync(conceptPath);

        for (const lang of languages) {
          const langPath = path.join(conceptPath, lang);
          if (!fs.statSync(langPath).isDirectory()) continue;

          const files = fs.readdirSync(langPath).filter(f => f.startsWith('judgment_'));

          stats.byConcept[concept] += files.length;
          stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + files.length;
          stats.total += files.length;

          // Read court info from judgments
          for (const file of files) {
            const filepath = path.join(langPath, file);
            const judgment = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
            const court = judgment.metadata?.court || 'Unknown';
            stats.byCourt[court] = (stats.byCourt[court] || 0) + 1;
          }
        }
      }

      console.log('By Concept:');
      Object.entries(stats.byConcept).forEach(([concept, count]) => {
        console.log(`  ${concept}: ${count}`);
      });

      console.log('\nBy Language:');
      Object.entries(stats.byLanguage).forEach(([lang, count]) => {
        const langName = INDIAN_LANGUAGES[lang as keyof typeof INDIAN_LANGUAGES] || lang;
        console.log(`  ${langName} (${lang}): ${count}`);
      });

      console.log('\nBy Court (Top 10):');
      Object.entries(stats.byCourt)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 10)
        .forEach(([court, count]) => {
          console.log(`  ${court}: ${count}`);
        });

      console.log(`\n📈 Total: ${stats.total} judgments\n`);
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

// Parse and execute
program.parse(process.argv);
