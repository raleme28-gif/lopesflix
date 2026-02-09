'use client'
import shaka from "shaka-player/dist/shaka-player.ui.js";
import { useEffect, useRef } from "react";
import "./index.scss";
import 'shaka-player/dist/controls.css';

interface MoviePlayerProps {
    url: string;
}
export const MoviePlayer = (props: MoviePlayerProps) => {
    const videoRef = useRef(null);
    const videoContainerReft = useRef(null);
    const playerRef = useRef<shaka.Player | null>(null);

    useEffect(() => {
        const initPlayer = async () => {
            const player = new shaka.Player(videoRef.current);
            playerRef.current = player;

            player.configure({
                streaming: {
                    bufferingGoal: 60,
                    rebufferingGoal: 10,
                    bufferBehind: 30,
                }
            });

            player.addEventListener('error', (event) => {
                console.error('Erro no Shaka Player: ', event);
            });

            try {
                await player.load(props.url);
                console.log('Vídeo carregado com sucesso!');
            } catch (error) {
                console.error('Erro ao carregar o vídeo: ', error);
            }};

            if (shaka.Player.isBrowserSupported()) {
                initPlayer();
            } else {
                console.error('Navegador não suportado pelo Shaka Player');
            }

            return () => {
                if (playerRef.current) {
                    playerRef.current.destroy();
                }
            };

        
    }, [props.url]);
    return (
        <div className="w-full shadow-2xl rounded-lg overflow-hidden bg-black">
            <div ref={videoContainerReft} className="max-w-full">
                <video 
                ref={videoRef} 
                className="w-full h-full" 
                autoPlay={false} 
                controlsList="nodownload"   
                />
            </div>
        </div>
    );
}

export default MoviePlayer;