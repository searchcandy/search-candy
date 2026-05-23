import Link from 'next/link'
import styles from '@/styles/GlossaryIndex.module.css'

export const metadata = {
  title: 'SEO Glossary & Reference Guide',
  description:
    'Our SEO glossary has definitions for over 170 different SEO entities. This glossary has been produced by multiple experienced SEO experts and has been peer reviewed for errors.',
  alternates: { canonical: 'https://searchcandy.uk/seo/seo-glossary/' },
}

export default function GlossaryIndex() {
  return (
    <main className={styles.GlossaryIndexContainer}>
      <section className={styles.GlossaryIndexHeader}>
        <h1>SEO Glossary &amp; Reference Guide</h1>
        <div>
          <p>SEO (search engine optimisation) can be full of jargon, abbreviations, and technical terminology.</p>
          <p>Our glossary has definitions for over 170 different SEO entities.</p>
          <p>This glossary has been produced by multiple experienced SEO experts and has been peer reviewed for errors.</p>
        </div>
      </section>

      <section className={styles.GlossaryInnerContainer}>
        <div>
          <h2>A</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/what-is-above-the-fold-content-on-a-website/">Above The Fold</Link></li>
            <li><Link href="/seo/seo-glossary/amp/">Accelerated Mobile Pages (AMP)</Link></li>
            <li><Link href="/seo/seo-glossary/ahrefs/">Ahrefs</Link></li>
            <li><Link href="/seo/seo-glossary/algorithm/">Algorithm</Link></li>
            <li><Link href="/seo/seo-glossary/alphabet/">Alphabet</Link></li>
            <li><Link href="/seo/seo-glossary/alt-text/">Alt text</Link></li>
            <li><Link href="/seo/seo-glossary/anchor-text/">Anchor text</Link></li>
            <li><Link href="/seo/seo-glossary/authority/">Authority</Link></li>
            <li><Link href="/seo/seo-glossary/authority-site/">Authority site</Link></li>
          </ul>
        </div>
        <div>
          <h2>B</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/backlinks/">Backlinks</Link></li>
            <li><Link href="/seo/seo-glossary/bard/">Bard</Link></li>
            <li><Link href="/seo/seo-glossary/barry-schwartz/">Barry Schwartz</Link></li>
            <li><Link href="/seo/seo-glossary/bert/">BERT</Link></li>
            <li><Link href="/seo/seo-glossary/bing/">Bing</Link></li>
            <li><Link href="/seo/seo-glossary/bingbot/">Bingbot</Link></li>
            <li><Link href="/seo/seo-glossary/bing-webmaster-tools/">Bing Webmaster Tools</Link></li>
            <li><Link href="/seo/seo-glossary/black-hat/">Black hat</Link></li>
            <li><Link href="/seo/seo-glossary/blogger-outreach/">Blogger outreach</Link></li>
            <li><Link href="/seo/seo-glossary/boolean-operators/">Boolean operators</Link></li>
            <li><Link href="/seo/seo-glossary/bot/">Bot</Link></li>
            <li><Link href="/seo/seo-glossary/bounce-rate/">Bounce rate</Link></li>
            <li><Link href="/seo/seo-glossary/branded-link/">Branded link</Link></li>
            <li><Link href="/seo/seo-glossary/breadcrumbs/">Breadcrumbs</Link></li>
            <li><Link href="/seo/seo-glossary/brighton-seo/">Brighton SEO</Link></li>
            <li><Link href="/seo/seo-glossary/broken-links/">Broken link</Link></li>
          </ul>
        </div>
        <div>
          <h2>C</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/canonical-tag/">Canonical tag</Link></li>
            <li><Link href="/seo/seo-glossary/canonical-url/">Canonical URL</Link></li>
            <li><Link href="/seo/seo-glossary/citation/">Citation (local SEO)</Link></li>
            <li><Link href="/seo/seo-glossary/ctr/">Click Through Rate (CTR)</Link></li>
            <li><Link href="/seo/seo-glossary/cloaking/">Cloaking</Link></li>
            <li><Link href="/seo/seo-glossary/cdn/">Content Delivery Network (CDN)</Link></li>
            <li><Link href="/seo/seo-glossary/content-marketing/">Content marketing</Link></li>
            <li><Link href="/seo/seo-glossary/cro/">Conversion Rate Optimisation (CRO)</Link></li>
            <li><Link href="/seo/seo-glossary/core-updates/">Core Updates</Link></li>
            <li><Link href="/seo/seo-glossary/core-web-vitals/">Core Web Vitals</Link></li>
            <li><Link href="/seo/seo-glossary/crawling/">Crawling</Link></li>
            <li><Link href="/seo/seo-glossary/crawl-errors/">Crawl errors</Link></li>
          </ul>
        </div>
        <div>
          <h2>D</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/danny-sullivan/">Danny Sullivan</Link></li>
            <li><Link href="/seo/seo-glossary/deindex/">Deindex</Link></li>
            <li><Link href="/seo/seo-glossary/disavowing-links/">Disavowing links</Link></li>
            <li><Link href="/seo/seo-glossary/disavow-tool/">Disavow tool</Link></li>
            <li><Link href="/seo/seo-glossary/da/">Domain Authority (DA)</Link></li>
            <li><Link href="/seo/seo-glossary/doorway-page/">Doorway page</Link></li>
            <li><Link href="/seo/seo-glossary/do-follow/">Do-follow link</Link></li>
            <li><Link href="/seo/seo-glossary/duplicate-content/">Duplicate content</Link></li>
          </ul>
        </div>
        <div>
          <h2>E</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/expertise-authoritativeness-trustworthiness-eat/">Expertise, Authoritativeness, Trustworthiness (EAT)</Link></li>
            <li><Link href="/seo/seo-glossary/external-link/">External links</Link></li>
            <li><Link href="/seo/seo-glossary/ecom-seo/">E-Commerce SEO</Link></li>
          </ul>
        </div>
        <div>
          <h2>F</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/featured-snippets/">Featured snippets</Link></li>
            <li><Link href="/seo/seo-glossary/fetch-as-google/">Fetch as Google</Link></li>
          </ul>
        </div>
        <div>
          <h2>G</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/googlebot/">Googlebot</Link></li>
            <li><Link href="/seo/seo-glossary/google-ads/">Google Ads</Link></li>
            <li><Link href="/seo/seo-glossary/google-analytics/">Google Analytics</Link></li>
            <li><Link href="/seo/seo-glossary/google-bomb/">Google Bomb</Link></li>
            <li><Link href="/seo/seo-glossary/google-bowling/">Google Bowling</Link></li>
            <li><Link href="/seo/seo-glossary/google-dance/">Google Dance</Link></li>
            <li><Link href="/seo/seo-glossary/google-discover/">Google Discover</Link></li>
            <li><Link href="/seo/seo-glossary/google-io/">Google I/O</Link></li>
            <li><Link href="/seo/seo-glossary/google-job-search/">Google Job Search</Link></li>
            <li><Link href="/seo/seo-glossary/google-news-sitemap/">Google News Sitemap</Link></li>
            <li><Link href="/seo/seo-glossary/google-posts/">Google Posts</Link></li>
            <li><Link href="/seo/seo-glossary/search-console/">Google Search Console</Link></li>
            <li><Link href="/seo/seo-glossary/google-shopping/">Google Shopping</Link></li>
            <li><Link href="/seo/seo-glossary/webmaster-guidelines/">Google Webmaster Guidelines</Link></li>
            <li><Link href="/seo/seo-glossary/grey-hat/">Grey hat</Link></li>
            <li><Link href="/seo/seo-glossary/growth-hacking/">Growth Hacking</Link></li>
          </ul>
        </div>
        <div>
          <h2>H</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/heading-tags/">Heading tags</Link></li>
            <li><Link href="/seo/seo-glossary/helpful-content-update/">Helpful Content Update</Link></li>
            <li><Link href="/seo/seo-glossary/hits/">Hits</Link></li>
            <li><Link href="/seo/seo-glossary/homepage/">Homepage</Link></li>
            <li><Link href="/seo/seo-glossary/html-sitemap/">HTML sitemap</Link></li>
            <li><Link href="/seo/seo-glossary/http-status-codes/">HTTP Response Status Codes</Link></li>
            <li><Link href="/seo/seo-glossary/hummingbird/">Hummingbird</Link></li>
            <li><Link href="/seo/seo-glossary/h1-tag/">H1 tag</Link></li>
          </ul>
        </div>
        <div>
          <h2>I</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/image-sitemap/">Image sitemap</Link></li>
            <li><Link href="/seo/seo-glossary/inbound-link/">Inbound link</Link></li>
            <li><Link href="/seo/seo-glossary/indexifembedded/">Indexifembedded</Link></li>
            <li><Link href="/seo/seo-glossary/index/">Indexing</Link></li>
            <li><Link href="/seo/seo-glossary/indexnow/">IndexNow</Link></li>
            <li><Link href="/seo/seo-glossary/internal-link/">Internal links</Link></li>
          </ul>
        </div>
        <div>
          <h2>J</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/jobposting/">JobPosting</Link></li>
            <li><Link href="/seo/seo-glossary/jobs/">Jobs</Link></li>
            <li><Link href="/seo/seo-glossary/john-mu/">John Mu</Link></li>
          </ul>
        </div>
        <div>
          <h2>K</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/keyword/">Keywords</Link></li>
            <li><Link href="/seo/seo-glossary/keyword-density/">Keyword density</Link></li>
            <li><Link href="/seo/seo-glossary/keyword-planner/">Keyword Planner</Link></li>
            <li><Link href="/seo/seo-glossary/keyword-research/">Keyword research</Link></li>
            <li><Link href="/seo/seo-glossary/knowledge-carousels/">Knowledge carousel</Link></li>
            <li><Link href="/seo/seo-glossary/knowledge-graph/">Knowledge graph</Link></li>
            <li><Link href="/seo/seo-glossary/knowledge-vault/">Knowledge Vault</Link></li>
          </ul>
        </div>
        <div>
          <h2>L</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/link/">Links</Link></li>
            <li><Link href="/seo/seo-glossary/link-bait/">Link bait</Link></li>
            <li><Link href="/seo/seo-glossary/link-building/">Link building</Link></li>
            <li><Link href="/seo/seo-glossary/link-equity/">Link equity</Link></li>
            <li><Link href="/seo/seo-glossary/link-exchange/">Link exchange</Link></li>
            <li><Link href="/seo/seo-glossary/local-seo/">Local SEO</Link></li>
          </ul>
        </div>
        <div>
          <h2>M</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/manual-penalty/">Manual action</Link></li>
            <li><Link href="/seo/seo-glossary/matt-cutts/">Matt Cutts</Link></li>
            <li><Link href="/seo/seo-glossary/meta-description-definition-guides-usage-examples/">Meta Description</Link></li>
            <li><Link href="/seo/seo-glossary/meta-keywords/">Meta keywords</Link></li>
            <li><Link href="/seo/seo-glossary/mobile-usability-report/">Mobile Usability report</Link></li>
            <li><Link href="/seo/seo-glossary/mobile-first-indexing/">Mobile-first indexing</Link></li>
            <li><Link href="/seo/seo-glossary/moz/">Moz</Link></li>
            <li><Link href="/seo/seo-glossary/mum/">MUM</Link></li>
          </ul>
        </div>
        <div>
          <h2>N</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/negative-seo/">Negative SEO</Link></li>
            <li><Link href="/seo/seo-glossary/noarchive/">Noarchive</Link></li>
            <li><Link href="/seo/seo-glossary/nofollow/">Nofollow</Link></li>
            <li><Link href="/seo/seo-glossary/noindex/">Noindex</Link></li>
            <li><Link href="/seo/seo-glossary/noopener/">Noopener</Link></li>
            <li><Link href="/seo/seo-glossary/noreferrer/">Noreferrer</Link></li>
          </ul>
        </div>
        <div>
          <h2>O</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/open-graph-protocol/">Open Graph Protocol</Link></li>
            <li><Link href="/seo/seo-glossary/organic-traffic/">Organic traffic</Link></li>
          </ul>
        </div>
        <div>
          <h2>P</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/pagerank/">PageRank</Link></li>
            <li><Link href="/seo/seo-glossary/pa/">Page Authority (PA)</Link></li>
            <li><Link href="/seo/seo-glossary/panda/">Panda</Link></li>
            <li><Link href="/seo/seo-glossary/pay-per-click/">Pay Per Click (PPC)</Link></li>
            <li><Link href="/seo/seo-glossary/penguin/">Penguin</Link></li>
            <li><Link href="/seo/seo-glossary/pigeon/">Pigeon</Link></li>
            <li><Link href="/seo/seo-glossary/preferred-domain/">Preferred domain</Link></li>
            <li><Link href="/seo/seo-glossary/pbn/">Private Blog Network (PBN)</Link></li>
          </ul>
        </div>
        <div>
          <h2>Q</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/query/">Query</Link></li>
          </ul>
        </div>
        <div>
          <h2>R</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/rankbrain/">RankBrain</Link></li>
            <li><Link href="/seo/seo-glossary/rankings/">Rankings</Link></li>
            <li><Link href="/seo/seo-glossary/rel-alternate-hreflang-definition-guide-usage-examples/">Rel=&quot;Alternate&quot; Hreflang Tag</Link></li>
            <li><Link href="/seo/seo-glossary/reputation-management/">Reputation management</Link></li>
            <li><Link href="/seo/seo-glossary/rich-cards/">Rich cards</Link></li>
            <li><Link href="/seo/seo-glossary/rich-results-test/">Rich Results Test</Link></li>
            <li><Link href="/seo/seo-glossary/rich-snippets/">Rich snippets</Link></li>
            <li><Link href="/seo/seo-glossary/robots-meta-tag/">Robots meta tag</Link></li>
            <li><Link href="/seo/seo-glossary/robots-txt/">Robots.txt</Link></li>
            <li><Link href="/seo/seo-glossary/roi/">ROI</Link></li>
            <li><Link href="/seo/seo-glossary/root-domain/">Root domain</Link></li>
          </ul>
        </div>
        <div>
          <h2>S</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/sandbox/">Sandbox</Link></li>
            <li><Link href="/seo/seo-glossary/screaming-frog/">Screaming Frog</Link></li>
            <li><Link href="/seo/seo-glossary/search-engine-friendly-urls/">Search engine friendly URLs</Link></li>
            <li><Link href="/seo/seo-glossary/sem/">Search Engine Marketing (SEM)</Link></li>
            <li><Link href="/seo/seo-glossary/search-operators/">Search operators</Link></li>
            <li><Link href="/seo/seo-glossary/search-visibility/">Search visibility</Link></li>
            <li><Link href="/seo/seo-glossary/seo/">SEO</Link></li>
            <li><Link href="/seo/seo-glossary/serps/">SERPs</Link></li>
            <li><Link href="/seo/seo-glossary/signed-exchanges/">Signed Exchanges (SGX)</Link></li>
            <li><Link href="/seo/seo-glossary/sitemap/">Sitemaps</Link></li>
            <li><Link href="/seo/seo-glossary/site-names/">Site Names</Link></li>
            <li><Link href="/seo/seo-glossary/structured-data/">Structured data</Link></li>
            <li><Link href="/seo/seo-glossary/subdomain/">Subdomain</Link></li>
          </ul>
        </div>
        <div>
          <h2>T</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/technical-seo/">Technical SEO</Link></li>
            <li><Link href="/seo/seo-glossary/title-tag/">Title tag</Link></li>
            <li><Link href="/seo/seo-glossary/topical-trust-flow/">Topical Trust Flow</Link></li>
            <li><Link href="/seo/seo-glossary/trust-flow-tf/">Trust Flow (TF)</Link></li>
          </ul>
        </div>
        <div>
          <h2>U</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/unique-content/">Unique content</Link></li>
          </ul>
        </div>
        <div>
          <h2>V</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/vertical/">Vertical</Link></li>
          </ul>
        </div>
        <div>
          <h2>W</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/website-speed/">Website speed</Link></li>
            <li><Link href="/seo/seo-glossary/white-hat/">White hat</Link></li>
            <li><Link href="/seo/seo-glossary/widget/">Widget</Link></li>
          </ul>
        </div>
        <div>
          <h2>X</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/google-x/">X</Link></li>
            <li><Link href="/seo/seo-glossary/xml-sitemap/">XML sitemap</Link></li>
            <li><Link href="/seo/seo-glossary/x-robots-tag/">X-Robots-Tag</Link></li>
          </ul>
        </div>
        <div>
          <h2>Y</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/yoast/">Yoast</Link></li>
            <li><Link href="/seo/seo-glossary/ymyl/">Your Money or Your Life</Link></li>
          </ul>
        </div>
        <div>
          <h2>#</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/http-200/">200 OK</Link></li>
            <li><Link href="/seo/seo-glossary/http-301/">301 Moved Permanently</Link></li>
            <li><Link href="/seo/seo-glossary/http-302/">302 Found</Link></li>
            <li><Link href="/seo/seo-glossary/http-303/">303 See Other</Link></li>
            <li><Link href="/seo/seo-glossary/http-307/">307 Temporary Redirect</Link></li>
            <li><Link href="/seo/seo-glossary/http-308/">308 Permanent Redirect</Link></li>
            <li><Link href="/seo/seo-glossary/http-403/">403 Forbidden</Link></li>
            <li><Link href="/seo/seo-glossary/http-404/">404 Not Found</Link></li>
            <li><Link href="/seo/seo-glossary/http-410/">410 Gone</Link></li>
            <li><Link href="/seo/seo-glossary/http-451/">451 Unavailable For Legal Reasons</Link></li>
            <li><Link href="/seo/seo-glossary/http-500/">500 Internal Server Error</Link></li>
          </ul>
        </div>

        <div>
          <h2>Featured listings</h2>
          <ul>
            <li><Link href="/seo/seo-glossary/helpful-content-update/" title="Google Helpful Content Update">Google Helpful Content Update</Link></li>
            <li><Link href="/seo/seo-glossary/http-status-codes/" title="HTTP Response Status Codes">HTTP Response Status Codes</Link></li>
            <li><Link href="/seo/how-to-find-out-if-a-page-has-been-indexed-in-google/" title="How to check if a website has been indexed in Google">How to check if a website has been indexed in Google</Link></li>
            <li><Link href="/seo/view-google-cache/" title="How to view cached pages in Google">How to view cached pages in Google</Link></li>
            <li><Link href="/seo/seo-glossary/rel-alternate-hreflang-definition-guide-usage-examples/" title="Hreflang tags">Rel=&quot;Alternate&quot; Hreflang Tag</Link></li>
            <li><Link href="/seo/check-indexed-bing/" title="How to check if a website has been indexed in Bing?">How to check if a website has been indexed in Bing</Link></li>
          </ul>
        </div>
      </section>
    </main>
  )
}
