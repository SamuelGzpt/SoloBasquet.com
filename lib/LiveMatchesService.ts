export interface LiveMatch {
    id: string;
    homeTeam: {
        name: string;
        score: number;
        logo?: string;
    };
    awayTeam: {
        name: string;
        score: number;
        logo?: string;
    };
    status: 'live' | 'upcoming' | 'finished';
    quarter?: string;
    time?: string;
    date: string;
}

// This uses the open ESPN API (No Key Required)
export class LiveMatchesService {
    static async fetchLiveMatches(): Promise<LiveMatch[]> {
        const fetchGamesForDate = async (dateStr: string) => {
            try {
                // ESPN API expects date as YYYYMMDD
                const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateStr}`);
                if (!response.ok) return [];
                const data = await response.json();
                return data.events || [];
            } catch (error) {
                console.error("ESPN API Error:", error);
                return [];
            }
        };

        const getEspnDate = (date: Date) => {
            return date.toISOString().split('T')[0].replace(/-/g, '');
        };

        const today = new Date();
        let events = await fetchGamesForDate(getEspnDate(today));

        // Fallback: Check next 3 days if today is empty
        if (events.length === 0) {
            for (let i = 1; i <= 3; i++) {
                const nextDate = new Date(today);
                nextDate.setDate(today.getDate() + i);
                events = await fetchGamesForDate(getEspnDate(nextDate));
                if (events.length > 0) break;
            }
        }

        // Map real events to LiveMatch interface
        const realMatches: LiveMatch[] = events.map((event: any) => {
            const competition = event.competitions[0];
            const home = competition.competitors.find((c: any) => c.homeAway === 'home');
            const away = competition.competitors.find((c: any) => c.homeAway === 'away');

            return {
                id: event.id,
                homeTeam: {
                    name: home.team.shortDisplayName || home.team.name,
                    score: parseInt(home.score) || 0,
                    logo: home.team.logo
                },
                awayTeam: {
                    name: away.team.shortDisplayName || away.team.name,
                    score: parseInt(away.score) || 0,
                    logo: away.team.logo
                },
                status: mapStatus(event.status.type.state),
                quarter: (event.status.period && event.status.type.state === 'in') ? `Q${event.status.period}` : undefined,
                time: event.status.displayClock || undefined,
                date: event.date
            };
        });

        // Ensure at least 6 matches
        if (realMatches.length < 6) {
            const needed = 6 - realMatches.length;
            const mocks = generateMockMatches(needed, realMatches.length);
            return [...realMatches, ...mocks];
        }

        return realMatches;
    }
}

function generateMockMatches(count: number, startIndex: number): LiveMatch[] {
    const teams = [
        { name: 'Lakers', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png' },
        { name: 'Warriors', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png' },
        { name: 'Celtics', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png' },
        { name: 'Heat', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png' },
        { name: 'Bulls', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png' },
        { name: 'Nets', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png' },
        { name: 'Suns', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png' },
        { name: 'Bucks', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png' }
    ];

    return Array.from({ length: count }).map((_, i) => {
        const globalIndex = startIndex + i;
        // First 2 matches (index 0 and 1) are upcoming. The rest are finished.
        const status = globalIndex < 2 ? 'upcoming' : 'finished';

        const homeIdx = (i * 2) % teams.length;
        const awayIdx = (i * 2 + 1) % teams.length;

        return {
            id: `mock-${Date.now()}-${i}`,
            homeTeam: {
                name: teams[homeIdx].name,
                score: Math.floor(Math.random() * 120) + 80,
                logo: teams[homeIdx].logo
            },
            awayTeam: {
                name: teams[awayIdx].name,
                score: Math.floor(Math.random() * 120) + 80,
                logo: teams[awayIdx].logo
            },
            status: status,
            date: new Date().toISOString(),
            time: status === 'finished' ? 'Final' : '20:00 EST'
        };
    });
}

function mapStatus(state: string): 'live' | 'upcoming' | 'finished' {
    if (state === 'in') return 'live';
    if (state === 'post') return 'finished';
    return 'upcoming';
}
