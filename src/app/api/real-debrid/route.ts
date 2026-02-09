import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const apiToken = process.env.REAL_DEBRID_API_KEY;

    const { franc } = require('franc');

    const detectStreamLanguage = (title: string) => {
        const lang = franc(title, { minLength: 3 }) as string;

        const mapping: Record<string, string> = {
            'por': 'Português',
            'eng': 'Inglês',
            'spa': 'Espanhol',
        };
        
        return mapping[lang] || 'Desconhecido';

    };

    const parserTorrentName = (title: string) => {
        const ptn = require('parse-torrent-name');
        return ptn(title);
    }

    const processStreams = (streams: any[]) => {
        return streams
            .filter(s => {
                const parserResult = parserTorrentName(s.title);
                if (!s.name.includes("[RD+]")) return false;

                const camTerms = ["CAM", "TS"]
                if (camTerms.some(term => parserResult.quality?.includes(term))) {
                    return false;
                }

                const badAudio = ["DTS", "AC3", "EAC3", "5.1", "7.1", "ATMOS"];
                if (badAudio.some(term => parserResult.audio?.includes(term)))  return false;

                return true;
            }
            )
            .map(s => {
                const parts = s.title.split('\n');
                const sizeAndSeeds = parts[1];

                const parsed = parserTorrentName(s.title);
                const language = detectStreamLanguage(s.title);
                let score = 0;

                 if (language === 'Português') {
                    score = 10;
                } else if (language === 'Inglês') {
                    score = 8;
                } else if (language === 'Espanhol') {
                    score = 6;
                }

                return {
                    ...s,
                    cleanName: parsed.title,
                    displayLanguage: language,
                    score: score,
                    info: sizeAndSeeds,
                    quality: parsed.quality
                };
            })
            .sort((a,b) => b.score - a.score)
    };
    if (!apiToken) {
        return NextResponse.json(
            { error: 'API token not configured' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { imdbId, type = 'movie' } = body;
        const baseUrl = "https://torrentio.strem.fun";
        const config = `realdebrid=${apiToken}`;
        const url = `${baseUrl}/${config}/stream/${type}/${imdbId}.json`;

        const response = await fetch(url);
        const data = await response.json();
        console.log("Streams brutos:", data.streams);
        

        return NextResponse.json({ streams: processStreams(data.streams) });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch streams' },
            { status: 500 }
        );
    }
}

