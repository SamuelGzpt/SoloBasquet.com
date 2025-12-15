export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

interface RapidAPIArticle {
  url: string;
  title: string;
  description: string;
  author: string;
  image: string;
  publishedAt: string;
  source: string;
}

export async function fetchNewsAPI(): Promise<NewsArticle[]> {
  try {
    let data: NewsAPIResponse;

    // CHECK: Are we in Production?
    // In Vercel (Production), we MUST use the Proxy (/api/news) to avoid CORS/Free-Tier blocks.
    // In Local (Development), we can use the direct Key for simplicity (or the proxy if using 'vercel dev').
    const isProduction = import.meta.env.PROD;

    if (isProduction) {
      // --- PRODUCTION: Use Proxy ---
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error(`Proxy Error: ${response.statusText}`);
      data = await response.json();

    } else {
      // --- DEVELOPMENT: Use Direct Request (Legacy method) ---
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      const baseUrl = import.meta.env.VITE_NEWS_API_URL;

      if (!apiKey || !baseUrl) {
        console.warn("Missing VITE_NEWS_API_KEY for local development");
        return [];
      }

      const url = new URL(baseUrl);
      url.searchParams.append("q", "NBA OR basketball OR baloncesto");
      url.searchParams.append("language", "en");
      url.searchParams.append("sortBy", "publishedAt");
      url.searchParams.append("apiKey", apiKey);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(response.statusText);
      data = await response.json();
    }

    return data.status === "ok" ? data.articles : [];

  } catch (error) {
    console.error("NewsAPI Error:", error);
    return [];
  }
}

export async function fetchRapidAPI(): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  const baseUrl = import.meta.env.VITE_RAPIDAPI_URL;
  const host = import.meta.env.VITE_RAPIDAPI_HOST;

  if (!apiKey || !baseUrl || !host) return [];

  try {
    const response = await fetch(baseUrl, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': host
      }
    });

    if (!response.ok) throw new Error(response.statusText);

    const data: any = await response.json();
    const articles = Array.isArray(data) ? data : (data.articles || []);

    return articles.map((item: any) => ({
      source: { id: 'rapidapi', name: item.source || 'NBA News' },
      author: item.author || null,
      title: item.title,
      description: item.description || '',
      url: item.url,
      urlToImage: item.image || item.urlToImage || item.thumbnail || item.media || null,
      publishedAt: item.publishedAt || new Date().toISOString(),
      content: item.content || ''
    }));

  } catch (error) {
    console.error("RapidAPI Error:", error);
    return [];
  }
}

export async function fetchNews(): Promise<NewsArticle[]> {
  const [newsApiArticles, rapidApiArticles] = await Promise.all([
    fetchNewsAPI(),
    fetchRapidAPI()
  ]);

  const allNews = [...newsApiArticles, ...rapidApiArticles];

  const keywords = [
    // General Basketball Terms
    'basketball', 'nba', 'basket', 'baloncesto', 'hoops', 'dunk', 'three-pointer', 'layup', 'slam dunk',
    'point guard', 'shooting guard', 'small forward', 'power forward', 'center', 'playoffs', 'finals',

    // NBA Teams
    'lakers', 'celtics', 'warriors', 'bulls', 'knicks', 'heat', 'spurs', 'suns', 'jazz', 'nets',
    'bucks', 'sixers', 'nuggets', 'clippers', 'mavericks', 'rockets', 'pacers', 'pistons', 'cavs',
    'cavaliers', 'magic', 'hawks', 'hornets', 'wizards', 'kings', 'blazers', 'thunder', 'wolves',
    'timberwolves', 'grizzlies', 'pelicans', 'raptors',

    // Basketball Leagues
    'euroleague', 'fiba', 'ncaa', 'march madness', 'wnba', 'g league', 'acb',

    // Basketball Stars & Terms
    'lebron', 'curry', 'durant', 'giannis', 'jokic', 'embiid', 'tatum', 'luka', 'doncic',
    'triple-double', 'double-double', 'assist', 'rebound', 'block', 'steal'
  ];

  const filteredNews = allNews.filter(article => {
    // 1. Basic URL validity check (optional, but good to keep it basic)
    // We allow missing images now, as the UI handles placeholders.
    // if (!article.urlToImage) { /* allow */ }

    // 2. Filter out Known Bad Placeholders ONLY if we really want to exclude the article,
    // but better to just show the article with a default image.
    // So we skip the strict "Bad Image Terms" filter that drops the article entirely.

    // 3. Filter out Video content (YouTube, etc)
    if (article.url.includes('youtube.com') || article.url.includes('youtu.be') || article.url.includes('vimeo.com')) return false;
    if (article.source.name.toLowerCase().includes('youtube')) return false;
    if (article.title.startsWith('Video:') || article.title.startsWith('Watch:')) return false;

    // 4. Build text corpus for analysis (Title + Desc + Content + Source)
    const text = `${article.title} ${article.description} ${article.content} ${article.source.name}`.toLowerCase();

    // 4. Enhanced Exclusion List (MMA, Boxing, Business, Gambling, Non-Basketball Sports)
    const excludedTerms = [
      // Rappers/Musicians
      'youngboy',

      // American Football
      'nfl', 'football', 'quarterback', 'touchdown', 'super bowl',

      // Gambling
      'gambling', 'betting', 'casino', 'apuesta', 'lottery', 'odds', 'wager', 'sportsbook',

      // MMA - Comprehensive List
      'mma', 'ufc', 'bellator', 'cage', 'octagon', 'mixed martial arts',
      'mcgregor', 'conor mcgregor', 'khabib', 'nurmagomedov', 'adesanya', 'jones', 'jon jones',
      'rousey', 'miocic', 'ngannou', 'masvidal', 'diaz', 'pettis', 'ferguson', 'poirier',
      'holloway', 'volkanovski', 'cejudo', 'figueiredo', 'moreno', 'yan', 'sterling',
      'submission', 'knockout', 'ko/tko', 'tapout', 'ground and pound', 'rear naked choke',

      // Boxing
      'boxing', 'boxer', 'heavyweight', 'lightweight', 'welterweight', 'middleweight',
      'tyson fury', 'canelo', 'mayweather', 'pacquiao', 'joshua', 'wilder', 'usyk',
      'uppercut', 'jab', 'hook', 'ring', 'rounds', 'title fight', 'championship belt',

      // Wrestling
      'wwe', 'wrestling', 'wrestler', 'wrestlemania', 'smackdown', 'raw',

      // Other Combat Sports
      'fighter', 'fight night', 'combat sports', 'martial arts', 'kickboxing', 'muay thai',

      // Business/Finance
      'business', 'finance', 'stock', 'market', 'economy', 'money', 'merger', 'acquisition',
      'earnings', 'revenue', 'profit', 'shares', 'wall street', 'nasdaq', 'dow jones',

      // Other Sports
      'cricket', 'rugby', 'tennis', 'golf', 'baseball', 'mlb', 'soccer', 'fifa', 'premier league',
      'champions league', 'nhl', 'hockey', 'puck', 'goalkeeper', 'striker'
    ];

    const isExcluded = excludedTerms.some(term => text.includes(term));
    if (isExcluded) return false;

    // 5. Basketball Relevance Check
    return keywords.some(keyword => text.includes(keyword));
  });

  return filteredNews.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  ).slice(0, 15);
}
