"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Heart, Target, Trophy, Wind, Smile, Users, 
  CheckCircle2, Plus, ArrowRight, Gift, TrendingUp,
  Moon, Cloud, Zap, Star, Award, Home as HomeIcon,
  MessageCircle, Settings, X, ChevronDown, ChevronUp,
  Timer, Play, Pause, RotateCcw
} from "lucide-react";

type Screen = 
  | "home" 
  | "create-pet" 
  | "tasks" 
  | "timer" 
  | "breathe" 
  | "mood" 
  | "goals" 
  | "community";

type Task = {
  id: number;
  title: string;
  icon: string;
  energy: number;
  completed: boolean;
  category: string;
  selected: boolean;
};

type TimerPreset = {
  id: string;
  label: string;
  seconds: number | null; // null = contínuo
};

type BreathingExercise = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [petName, setPetName] = useState("Luna");
  const [petColor, setPetColor] = useState("#A78BFA");
  const [petPronouns, setPetPronouns] = useState("ela/dela");
  const [petLevel, setPetLevel] = useState(5);
  const [petMood, setPetMood] = useState("Feliz");
  const [energy, setEnergy] = useState(60);
  const [rainbowStones, setRainbowStones] = useState(12);
  const [streak, setStreak] = useState(7);
  const [showAllTasks, setShowAllTasks] = useState(false);
  
  // Timer states
  const [selectedPreset, setSelectedPreset] = useState<string>("1min");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timerPresets: TimerPreset[] = [
    { id: "1min", label: "01 minuto", seconds: 60 },
    { id: "2min", label: "02 minutos", seconds: 120 },
    { id: "3min", label: "03 minutos", seconds: 180 },
    { id: "5min", label: "05 minutos", seconds: 300 },
    { id: "continuous", label: "Contínuo", seconds: null },
  ];

  // Breathing exercises
  const breathingExercises: BreathingExercise[] = [
    {
      id: 1,
      name: "Respiração 4–4",
      description: "Inspirar 4s, expirar 4s"
    },
    {
      id: 2,
      name: "Respiração quadrada (4–4–4–4)",
      description: "Inspire pelo nariz (4s), segure o ar (4s), expire pela boca ou nariz (4s) e segure os pulmões vazios (4s)"
    },
    {
      id: 3,
      name: "Respiração profunda 5x",
      description: "Inspire lentamente pelo nariz, contando mentalmente até cinco, sentindo o ar preencher seus pulmões e expandir seu abdômen. Prenda a respiração por um momento (cerca de 2-3 segundos) e solte o ar devagar pela boca, contando mentalmente até cinco, esvaziando completamente os pulmões"
    },
    {
      id: 4,
      name: "Respiração 4–7–8",
      description: "Inspire pelo nariz por 4 segundos, prenda a respiração por 7 segundos e expire pela boca por 8 segundos"
    },
    {
      id: 5,
      name: "Respiração diafragmática",
      description: "inspire lentamente pelo nariz, sentindo a barriga expandir e expire pela boca sentindo a barriga contrair"
    },
    {
      id: 6,
      name: "Respiração \"cheiro da flor, sopro da vela\"",
      description: "Imagine que você tem uma flor bonita em uma das mãos. Inspire profunda e lentamente pelo nariz, como se estivesse sentindo o perfume agradável dessa flor. Em seguida imagine que você tem uma vela acesa na outra mão, expire devagar e suavemente pela boca, como se estivesse tentando apagar a vela sem fazer a chama voar muito forte. O objetivo é um sopro controlado. Repita esse ciclo de inspiração (flor) e expiração (vela) por 4 a 6 repetições para sentir o efeito calmante"
    },
    {
      id: 7,
      name: "Respirar destacando o som",
      description: "Comece a respirar naturalmente, inspirando e expirando pelo nariz. Concentre-se na sensação física da respiração: o ar entrando, a expansão do peito/barriga e o ar saindo. Agora, traga sua atenção para o som que a respiração produz. Ouça o chiado suave ou o fluxo do ar passando pelas narinas ou pela garganta. Tente perceber a diferença no som entre a inspiração e a expiração. A expiração geralmente produz um som ligeiramente mais audível ou um \"suspiro\" suave. Sua mente, inevitavelmente, irá divagar, isso é normal. Você pode começar a pensar em outras coisas ou em sons externos (trânsito, pessoas conversando). Quando notar que sua mente se distraiu, gentilmente e sem julgamento, traga o foco de volta para o som da sua própria respiração. Trate cada som — seja interno ou externo — como um lembrete para retornar ao seu foco principal. Comece praticando por 3 a 5 minutos, depois você pode aumentar a duração para 10, 15 ou 20 minutos, conforme se sentir mais confortável"
    },
    {
      id: 8,
      name: "Respirar com foco no abdômen",
      description: "Inspire lentamente pelo nariz, focando em expandir o abdômen, fazendo-o subir. O peito deve se mover pouco. Expire lentamente pela boca, como se estivesse soprando um canudo e sinta o abdômen se contrair suavemente e descer. Repita o processo, focando em uma respiração profunda e relaxante."
    },
    {
      id: 9,
      name: "Sigh breathing (suspiro relaxante)",
      description: "Inspire profundamente pelo nariz, enchendo os pulmões a cerca de 80% da capacidade. Faça uma segunda inalação curta e rápida, também pelo nariz, para expandir totalmente os pulmões e abrir os sacos de ar (alvéolos) remanescentes. Pode parecer um \"gole\" extra de ar. Expire lentamente pela boca, soltando todo o ar de uma vez em um suspiro suave e prolongado. Repita o ciclo de 1 a 3 vezes, ou quantas vezes sentir necessário, para restaurar a calma."
    },
    {
      id: 10,
      name: "Respiração 3–6",
      description: "Inspire 3s, expire 6s"
    },
    {
      id: 11,
      name: "Respiração em ondas",
      description: "Inspire suave, segure, solte longo"
    },
    {
      id: 12,
      name: "Respiração com foco no coração",
      description: "Inspirar profundamente contando mentalmente até 4, prender o ar por 7 segundos e expira lentamente por 8 segundos, repetindo o ciclo para acalmar o corpo e diminuir a frequência cardíaca"
    },
    {
      id: 13,
      name: "Respiração \"liberar tensão\" (soltando ombros)",
      description: "Inspire e expire algumas vezes naturalmente, prestando atenção à sensação do ar entrando e saindo do seu corpo. Sinta o peso do seu corpo se acomodando contra o chão ou a cadeira. Inspire profunda e lentamente pelo nariz. Enquanto inspira, levante os ombros em direção às orelhas o máximo que puder, criando bastante tensão na área dos trapézios e pescoço. Segure a respiração e a tensão nos ombros por 2 a 3 segundos. Sinta o pico da tensão. Expire pela boca de forma rápida e audível (como um suspiro de alívio), e simultaneamente deixe seus ombros caírem de volta à posição inicial. A soltura deve ser um movimento de \"liberação\" imediata, como se um peso fosse retirado de você. Após soltar, faça uma pequena pausa e observe a sensação de alívio e leveza nos ombros e pescoço"
    },
    {
      id: 14,
      name: "Duas respirações curtas + uma longa (alívio rápido)",
      description: "Inspire rapidamente pelo nariz, enchendo os pulmões parcialmente. Imediatamente, inspire novamente pelo nariz para encher completamente o restante dos pulmões. Você sentirá uma ligeira pausa natural no topo da inspiração. Solte o ar lentamente pela boca, esvaziando completamente os pulmões. Repita esse ciclo de 3 a 5 vezes ou conforme necessário, para sentir o alívio rápido"
    }
  ];

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (isContinuous) {
            return prev + 1; // Conta para cima no modo contínuo
          } else {
            if (prev <= 1) {
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isContinuous]);

  const handlePresetSelect = (preset: TimerPreset) => {
    setSelectedPreset(preset.id);
    setIsRunning(false);
    if (preset.seconds === null) {
      setIsContinuous(true);
      setTimeLeft(0);
    } else {
      setIsContinuous(false);
      setTimeLeft(preset.seconds);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const preset = timerPresets.find(p => p.id === selectedPreset);
    if (preset) {
      if (preset.seconds === null) {
        setTimeLeft(0);
      } else {
        setTimeLeft(preset.seconds);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Lista completa de tarefas organizadas por categoria
  const [allTasks, setAllTasks] = useState<Task[]>([
    // Tarefas do dia
    { id: 1, title: "Beber 1 copo de água", icon: "💧", energy: 5, completed: false, category: "Tarefas do dia", selected: true },
    { id: 2, title: "Arrumar a cama", icon: "🛏️", energy: 10, completed: false, category: "Tarefas do dia", selected: true },
    { id: 3, title: "Alongar por 2 minutos", icon: "🤸", energy: 10, completed: false, category: "Tarefas do dia", selected: true },
    { id: 4, title: "Fazer uma caminhada curta", icon: "🚶", energy: 15, completed: false, category: "Tarefas do dia", selected: true },
    { id: 5, title: "Enviar uma mensagem para alguém querido", icon: "💌", energy: 10, completed: false, category: "Tarefas do dia", selected: true },
    { id: 6, title: "Desligar o celular por 5 minutos", icon: "📵", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 7, title: "Ler 1 página de um livro", icon: "📖", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 8, title: "Tomar um banho relaxante", icon: "🛁", energy: 15, completed: false, category: "Tarefas do dia", selected: false },
    { id: 9, title: "Fazer um lanche saudável", icon: "🥗", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 10, title: "Agradecer por algo que aconteceu hoje", icon: "🙏", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 11, title: "Fazer 1 minuto de respiração profunda", icon: "🌬️", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 12, title: "Organizar um pequeno espaço", icon: "🗂️", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 13, title: "Caminhar 200 passos", icon: "👟", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 14, title: "Tomar um copo de água ao acordar", icon: "☀️", energy: 5, completed: false, category: "Tarefas do dia", selected: false },
    { id: 15, title: "Escrever 1 coisa boa que aconteceu", icon: "✍️", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 16, title: "Fazer um alongamento antes de dormir", icon: "🌙", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 17, title: "Passar protetor solar", icon: "🧴", energy: 5, completed: false, category: "Tarefas do dia", selected: false },
    { id: 18, title: "Ouvir uma música que te acalme", icon: "🎵", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 19, title: "Preparar um lanche nutritivo", icon: "🍎", energy: 10, completed: false, category: "Tarefas do dia", selected: false },
    { id: 20, title: "Ficar 1 minuto em silêncio", icon: "🤫", energy: 10, completed: false, category: "Tarefas do dia", selected: false },

    // Alongamentos
    { id: 21, title: "Alongamento do pescoço (30s)", icon: "🦒", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 22, title: "Alongamento da coluna sentado", icon: "🪑", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 23, title: "Posição da criança (yoga)", icon: "🧘", energy: 15, completed: false, category: "Alongamentos", selected: false },
    { id: 24, title: "Respiração + alongamento lateral", icon: "🌬️", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 25, title: "Alongamento de ombros", icon: "💪", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 26, title: "Mobilidade de quadril", icon: "🦵", energy: 15, completed: false, category: "Alongamentos", selected: false },
    { id: 27, title: "Pose do gato e vaca", icon: "🐱", energy: 15, completed: false, category: "Alongamentos", selected: false },
    { id: 28, title: "Rotação suave de tornozelos", icon: "👣", energy: 5, completed: false, category: "Alongamentos", selected: false },
    { id: 29, title: "Caminhada leve dentro de casa", icon: "🏠", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 30, title: "Alongamento de pernas na parede", icon: "🧱", energy: 15, completed: false, category: "Alongamentos", selected: false },
    { id: 31, title: "Alongamento de punhos e dedos", icon: "✋", energy: 5, completed: false, category: "Alongamentos", selected: false },
    { id: 32, title: "Elevar braços e abrir o peito", icon: "🤗", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 33, title: "Torção suave da coluna sentado", icon: "🔄", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 34, title: "Alongamento de panturrilha na parede", icon: "🦿", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 35, title: "Postura da montanha (yoga)", icon: "⛰️", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 36, title: "Giro leve de quadris", icon: "💃", energy: 10, completed: false, category: "Alongamentos", selected: false },
    { id: 37, title: "Caminhar 1 minuto pelo ambiente", icon: "🚶‍♀️", energy: 5, completed: false, category: "Alongamentos", selected: false },
    { id: 38, title: "Alongamento de antebraços", icon: "💻", energy: 5, completed: false, category: "Alongamentos", selected: false },
    { id: 39, title: "Movimento em círculos com os ombros", icon: "🔁", energy: 5, completed: false, category: "Alongamentos", selected: false },
    { id: 40, title: "Elevar calcanhares e dedos alternando", icon: "🦶", energy: 5, completed: false, category: "Alongamentos", selected: false },

    // Atos de bondade
    { id: 41, title: "Mandar uma mensagem de carinho", icon: "💝", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 42, title: "Fazer elogio sincero a alguém", icon: "🌟", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 43, title: "Elogiar a si mesmo no espelho", icon: "🪞", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 44, title: "Ajudar alguém com uma tarefa", icon: "🤝", energy: 20, completed: false, category: "Atos de bondade", selected: false },
    { id: 45, title: "Deixar um recado positivo", icon: "📝", energy: 10, completed: false, category: "Atos de bondade", selected: false },
    { id: 46, title: "Separar algo para doação", icon: "📦", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 47, title: "Cozinhar algo gostoso para si", icon: "🍳", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 48, title: "Fazer um pequeno favor", icon: "🎁", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 49, title: "Dizer obrigado com intenção", icon: "🙌", energy: 10, completed: false, category: "Atos de bondade", selected: false },
    { id: 50, title: "Praticar gentileza consigo", icon: "💖", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 51, title: "Tirar um momento para descansar", icon: "😌", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 52, title: "Fazer um elogio para colega", icon: "👔", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 53, title: "Oferecer ajuda a alguém próximo", icon: "🆘", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 54, title: "Preparar algo gostoso para alguém", icon: "🍰", energy: 20, completed: false, category: "Atos de bondade", selected: false },
    { id: 55, title: "Escrever carta de gratidão", icon: "✉️", energy: 20, completed: false, category: "Atos de bondade", selected: false },
    { id: 56, title: "Ser gentil consigo após um erro", icon: "🤗", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 57, title: "Deixar comentário positivo online", icon: "💬", energy: 10, completed: false, category: "Atos de bondade", selected: false },
    { id: 58, title: "Segurar a porta para alguém", icon: "🚪", energy: 10, completed: false, category: "Atos de bondade", selected: false },
    { id: 59, title: "Ajudar um amigo com uma dúvida", icon: "❓", energy: 15, completed: false, category: "Atos de bondade", selected: false },
    { id: 60, title: "Falar consigo com mais carinho", icon: "💕", energy: 15, completed: false, category: "Atos de bondade", selected: false },

    // Relaxar/Acalmar
    { id: 61, title: "Exercício 5-4-3-2-1 (sensorial)", icon: "🔢", energy: 20, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 62, title: "Respiração lenta para ansiedade", icon: "😮‍💨", energy: 20, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 63, title: "Fale tudo o que está sentindo", icon: "🗣️", energy: 20, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 64, title: "Escanear o corpo (body scan)", icon: "🧘‍♀️", energy: 20, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 65, title: "Relaxamento de músculos tensos", icon: "💆", energy: 20, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 66, title: "Escreva pensamentos seguros", icon: "📋", energy: 15, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 67, title: "Visualizar um lugar seguro", icon: "🏡", energy: 20, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 68, title: "Visualizar um lugar feliz", icon: "🌈", energy: 20, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 69, title: "O que eu posso fazer agora?", icon: "🤔", energy: 15, completed: false, category: "Relaxar/Acalmar", selected: false },
    { id: 70, title: "Fazer autoabraço terapêutico", icon: "🫂", energy: 20, completed: false, category: "Relaxar/Acalmar", selected: false },

    // Timer (NOVA CATEGORIA)
    { id: 71, title: "Timer de meditação 1 minuto", icon: "🧘", energy: 10, completed: false, category: "Timer", selected: false },
    { id: 72, title: "Timer de foco 5 minutos", icon: "🎯", energy: 15, completed: false, category: "Timer", selected: false },
    { id: 73, title: "Timer de descanso ocular 20/20 segundos", icon: "👁️", energy: 5, completed: false, category: "Timer", selected: false },
    { id: 74, title: "Timer de respiração 3 minutos", icon: "🌬️", energy: 15, completed: false, category: "Timer", selected: false },
    { id: 75, title: "Timer de pausa mental 2 minutos", icon: "🧠", energy: 10, completed: false, category: "Timer", selected: false },
    { id: 76, title: "Timer de relaxamento antes de dormir 10 minutos", icon: "🌙", energy: 20, completed: false, category: "Timer", selected: false },
    { id: 77, title: "Timer de silêncio total 60 segundos", icon: "🤫", energy: 10, completed: false, category: "Timer", selected: false },
    { id: 78, title: "Timer de gratidão 1 minuto", icon: "🙏", energy: 10, completed: false, category: "Timer", selected: false },
    { id: 79, title: "Timer para beber água a cada 30 min", icon: "💧", energy: 5, completed: false, category: "Timer", selected: false },
    { id: 80, title: "Timer de foco de 5 minutos", icon: "⏱️", energy: 15, completed: false, category: "Timer", selected: false },
    { id: 81, title: "Timer de respiração 1 minuto", icon: "😮‍💨", energy: 10, completed: false, category: "Timer", selected: false },
    { id: 82, title: "Timer para esticar o corpo (01 minuto)", icon: "🤸", energy: 10, completed: false, category: "Timer", selected: false },
    { id: 83, title: "Timer de silêncio mental (2 minutos)", icon: "🧘‍♀️", energy: 10, completed: false, category: "Timer", selected: false },
    { id: 84, title: "Timer de meditação 3 minutos", icon: "🕉️", energy: 15, completed: false, category: "Timer", selected: false },
    { id: 85, title: "Timer para descanso emocional (5 minutos)", icon: "💆‍♀️", energy: 15, completed: false, category: "Timer", selected: false },
    { id: 86, title: "Timer de relaxamento pós-trabalho (5 minutos)", icon: "☕", energy: 15, completed: false, category: "Timer", selected: false },
  ]);

  const [goals, setGoals] = useState([
    { id: 1, title: "Meditar 7 dias seguidos", progress: 5, target: 7, icon: "🧘" },
    { id: 2, title: "Beber 2L de água por dia", progress: 14, target: 30, icon: "💧" },
    { id: 3, title: "Dormir 8h por noite", progress: 3, target: 7, icon: "😴" },
  ]);

  const [moodHistory, setMoodHistory] = useState([
    { date: "Hoje", mood: "Feliz", emoji: "😊", intensity: 4 },
    { date: "Ontem", mood: "Calmo", emoji: "😌", intensity: 3 },
    { date: "2 dias atrás", mood: "Ansioso", emoji: "😰", intensity: 2 },
  ]);

  // Filtrar tarefas selecionadas
  const selectedTasks = allTasks.filter(t => t.selected);
  const completedTasks = selectedTasks.filter(t => t.completed).length;
  const totalTasks = selectedTasks.length;

  // Tarefas visíveis na Home (5 primeiras ou todas se expandido)
  const visibleHomeTasks = showAllTasks ? selectedTasks : selectedTasks.slice(0, 5);

  const toggleTask = (id: number) => {
    setAllTasks(allTasks.map(task => {
      if (task.id === id && !task.completed) {
        const newEnergy = energy + task.energy;
        if (newEnergy >= 100) {
          setRainbowStones(prev => prev + 1);
          setEnergy(newEnergy - 100);
        } else {
          setEnergy(newEnergy);
        }
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const toggleTaskSelection = (id: number) => {
    setAllTasks(allTasks.map(task => 
      task.id === id ? { ...task, selected: !task.selected } : task
    ));
  };

  // BOTTOM NAVIGATION
  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-purple-100 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => setCurrentScreen("home")}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentScreen === "home" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen("tasks")}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentScreen === "tasks" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-xs font-medium">Tarefas</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen("timer")}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentScreen === "timer" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Timer className="w-6 h-6" />
            <span className="text-xs font-medium">Timer</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen("breathe")}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentScreen === "breathe" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Wind className="w-6 h-6" />
            <span className="text-xs font-medium">Respiração</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen("create-pet")}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentScreen === "create-pet" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-medium">Pet</span>
          </button>
        </div>
      </div>
    </nav>
  );

  // HOME SCREEN
  if (currentScreen === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        {/* Header Compacto */}
        <header className="p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Serenii
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-200 shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-gray-700">{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-full border border-purple-300 shadow-sm">
              <Trophy className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-700">{rainbowStones}</span>
            </div>
          </div>
        </header>

        <main className="px-4 space-y-6">
          {/* Pet Card - Estilo Finch */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-200 overflow-hidden shadow-lg">
            {/* Background decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              {/* Pet Avatar Grande */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div 
                    className="w-48 h-48 rounded-full flex items-center justify-center shadow-xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${petColor}, ${petColor}dd)`,
                      boxShadow: `0 20px 60px ${petColor}40`,
                      animation: "float 3s ease-in-out infinite"
                    }}
                  >
                    <Heart className="w-24 h-24 text-white" />
                  </div>
                  {/* Level Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-4 border-white">
                    {petLevel}
                  </div>
                  {/* Mood Badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-purple-200 px-4 py-1.5 rounded-full shadow-md">
                    <span className="text-sm font-medium text-gray-700">{petMood} 😊</span>
                  </div>
                </div>
              </div>

              {/* Pet Info */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-1">{petName}</h2>
                <p className="text-gray-500 text-sm">{petPronouns}</p>
              </div>

              {/* Energy Progress - Destaque */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 backdrop-blur-sm border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-gray-700">Energia</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{energy}/100</span>
                </div>
                <div className="relative w-full h-4 bg-white/60 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${energy}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {100 - energy} energia até ganhar uma pedra do arco-íris! 💎
                </p>
              </div>
            </div>
          </div>

          {/* Daily Tasks Preview - Estilo Finch */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">Tarefas de Hoje</h3>
              <button 
                onClick={() => setCurrentScreen("tasks")}
                className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:text-purple-700 transition-colors"
              >
                Gerenciar <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {visibleHomeTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => !task.completed && toggleTask(task.id)}
                  disabled={task.completed}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    task.completed 
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 shadow-sm' 
                      : 'bg-white/80 backdrop-blur-sm border border-purple-200 hover:shadow-md active:scale-[0.98] shadow-sm'
                  }`}
                >
                  <div className="text-4xl">{task.icon}</div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{task.category}</span>
                      <span className="text-xs text-purple-600 font-medium">+{task.energy} ⚡</span>
                    </div>
                  </div>
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-purple-300" />
                  )}
                </button>
              ))}
            </div>

            {/* Botão Ver Lista Completa */}
            {selectedTasks.length > 5 && (
              <button
                onClick={() => setShowAllTasks(!showAllTasks)}
                className="w-full mt-3 bg-white/80 backdrop-blur-sm border border-purple-200 hover:shadow-md rounded-xl p-3 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span className="font-medium text-gray-800 text-sm">
                  {showAllTasks ? 'Ver menos' : `Ver lista completa (${selectedTasks.length - 5} mais)`}
                </span>
                {showAllTasks ? <ChevronUp className="w-4 h-4 text-purple-600" /> : <ChevronDown className="w-4 h-4 text-purple-600" />}
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600 mb-1">{completedTasks}/{totalTasks}</div>
              <div className="text-xs text-gray-600">Completas</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600 mb-1">{streak}</div>
              <div className="text-xs text-gray-600">Dias seguidos</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600 mb-1">{rainbowStones}</div>
              <div className="text-xs text-gray-600">Pedras</div>
            </div>
          </div>

          {/* Daily Motivation */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border border-purple-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1 text-sm text-gray-800">Mensagem do Dia ✨</h4>
                <p className="text-gray-700 text-sm">
                  "Cada pequeno passo conta. Você está cuidando de si mesmo e isso é incrível! Continue assim! 💜"
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentScreen("breathe")}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 hover:shadow-md transition-all text-left shadow-sm"
            >
              <Wind className="w-8 h-8 text-blue-500 mb-2" />
              <p className="font-bold text-sm text-gray-800">Respiração</p>
              <p className="text-xs text-gray-600">Relaxe agora</p>
            </button>
            <button
              onClick={() => setCurrentScreen("mood")}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 hover:shadow-md transition-all text-left shadow-sm"
            >
              <Smile className="w-8 h-8 text-amber-500 mb-2" />
              <p className="font-bold text-sm text-gray-800">Humor</p>
              <p className="text-xs text-gray-600">Como está?</p>
            </button>
          </div>
        </main>

        <BottomNav />

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  // CREATE PET SCREEN
  if (currentScreen === "create-pet") {
    const colors = [
      "#A78BFA", "#EC4899", "#3B82F6", "#10B981", 
      "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Personalize seu Pet
          </h2>

          {/* Pet Preview */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                className="w-48 h-48 rounded-full flex items-center justify-center shadow-xl"
                style={{ 
                  background: `linear-gradient(135deg, ${petColor}, ${petColor}dd)`,
                  boxShadow: `0 20px 60px ${petColor}40`,
                  animation: "float 3s ease-in-out infinite"
                }}
              >
                <Heart className="w-24 h-24 text-white" />
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Nome do Pet</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
              placeholder="Digite um nome..."
            />
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-gray-700">Escolha uma cor</label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setPetColor(color)}
                  className={`w-full aspect-square rounded-xl transition-all shadow-md ${
                    petColor === color 
                      ? 'ring-4 ring-purple-500 scale-105' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Pronouns Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-3 text-gray-700">Pronomes</label>
            <div className="grid grid-cols-3 gap-3">
              {["ele/dele", "ela/dela", "elu/delu"].map(pronoun => (
                <button
                  key={pronoun}
                  onClick={() => setPetPronouns(pronoun)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all shadow-sm ${
                    petPronouns === pronoun
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-purple-200'
                  }`}
                >
                  {pronoun}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen("home")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform shadow-lg"
          >
            Salvar Alterações
          </button>
        </div>

        <BottomNav />

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  // TASKS SCREEN - VERSÃO SEM BOTÃO DE DELETAR
  if (currentScreen === "tasks") {
    // Agrupar tarefas por categoria (incluindo Timer)
    const categories = ["Tarefas do dia", "Alongamentos", "Atos de bondade", "Relaxar/Acalmar", "Timer"];
    const tasksByCategory = categories.map(category => ({
      name: category,
      tasks: allTasks.filter(t => t.category === category)
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gerenciar Tarefas
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Selecione as atividades que você quer cumprir hoje
          </p>

          {/* Progress Card */}
          <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tarefas Selecionadas</p>
                <p className="text-2xl font-bold text-gray-800">{selectedTasks.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Completas Hoje</p>
                <p className="text-2xl font-bold text-purple-600">{completedTasks}/{totalTasks}</p>
              </div>
            </div>
          </div>

          {/* Tasks by Category */}
          <div className="space-y-6">
            {tasksByCategory.map(category => (
              <div key={category.name}>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
                  {category.name}
                  <span className="text-sm font-normal text-gray-500">
                    ({category.tasks.filter(t => t.selected).length}/{category.tasks.length})
                  </span>
                </h3>
                
                <div className="space-y-2">
                  {category.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        task.selected
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 shadow-sm'
                          : 'bg-white/80 backdrop-blur-sm border border-purple-200'
                      }`}
                    >
                      {/* Checkbox para selecionar */}
                      <button
                        onClick={() => toggleTaskSelection(task.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          task.selected
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                            : 'border-purple-300 hover:border-purple-400'
                        }`}
                      >
                        {task.selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>

                      {/* Icon e Info */}
                      <div className="text-2xl">{task.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{task.title}</p>
                        <p className="text-xs text-purple-600">+{task.energy} ⚡</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border border-purple-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1 text-sm text-gray-800">Dica</h4>
                <p className="text-gray-700 text-xs">
                  Selecione as tarefas que você quer fazer hoje. Elas aparecerão na sua tela inicial!
                </p>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // TIMER SCREEN
  if (currentScreen === "timer") {
    const progress = isContinuous ? 100 : ((timeLeft / (timerPresets.find(p => p.id === selectedPreset)?.seconds || 60)) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Temporizador
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Escolha o tempo e relaxe
          </p>

          {/* Timer Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-200 mb-6 shadow-lg">
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Circular Progress */}
                <svg className="w-64 h-64 transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="#E9D5FF"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A78BFA" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isContinuous ? "Modo Contínuo" : timerPresets.find(p => p.id === selectedPreset)?.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={resetTimer}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <RotateCcw className="w-6 h-6 text-gray-700" />
              </button>
              
              <button
                onClick={toggleTimer}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                {isRunning ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </button>
              
              <div className="w-14 h-14" /> {/* Spacer for symmetry */}
            </div>
          </div>

          {/* Timer Presets */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 shadow-lg">
            <h3 className="font-bold mb-4 text-sm text-gray-800">Escolha o tempo</h3>
            <div className="grid grid-cols-2 gap-3">
              {timerPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  disabled={isRunning}
                  className={`py-4 px-4 rounded-xl font-medium transition-all shadow-sm ${
                    selectedPreset === preset.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105'
                      : 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-700 hover:shadow-md border border-purple-200'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border border-purple-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Timer className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1 text-sm text-gray-800">Dica</h4>
                <p className="text-gray-700 text-xs">
                  Use o temporizador para meditar, respirar ou simplesmente relaxar. No modo contínuo, você controla quando parar!
                </p>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // BREATHE SCREEN - NOVA VERSÃO COM TÉCNICAS DE RESPIRAÇÃO
  if (currentScreen === "breathe") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Técnicas de Respiração
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Escolha uma técnica e siga as instruções para relaxar
          </p>

          {/* Featured Breathing Animation */}
          <div className="bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 mb-6 text-center shadow-lg">
            <div 
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-xl"
              style={{ animation: "breathe 4s ease-in-out infinite" }}
            >
              <Wind className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Respire Profundamente</h3>
            <p className="text-gray-600 mb-4 text-sm">Escolha uma técnica abaixo para começar</p>
          </div>

          {/* Breathing Exercises List */}
          <div className="space-y-3">
            {breathingExercises.map(exercise => (
              <div
                key={exercise.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Wind className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-800 mb-2">{exercise.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{exercise.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border border-blue-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Wind className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1 text-sm text-gray-800">Dica</h4>
                <p className="text-gray-700 text-xs">
                  Pratique essas técnicas em um ambiente tranquilo. Comece com 2-3 minutos e aumente gradualmente conforme se sentir confortável.
                </p>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />

        <style jsx>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.15); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // MOOD SCREEN
  if (currentScreen === "mood") {
    const moods = [
      { emoji: "😊", label: "Feliz", color: "#10B981" },
      { emoji: "😌", label: "Calmo", color: "#3B82F6" },
      { emoji: "😰", label: "Ansioso", color: "#F59E0B" },
      { emoji: "😢", label: "Triste", color: "#8B5CF6" },
      { emoji: "😡", label: "Irritado", color: "#EF4444" },
      { emoji: "😴", label: "Cansado", color: "#6B7280" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Como você está?
          </h2>
          <p className="text-gray-600 text-sm mb-6">Registre seu humor e acompanhe suas emoções</p>

          {/* Mood Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 border border-purple-200 mb-6 shadow-lg">
            <h3 className="font-bold mb-4 text-sm text-gray-800">Selecione seu humor atual</h3>
            <div className="grid grid-cols-3 gap-3">
              {moods.map(mood => (
                <button
                  key={mood.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-md transition-all hover:scale-105 active:scale-95 border border-purple-200"
                >
                  <span className="text-4xl">{mood.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood History */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-800">Histórico de Humor</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              {moodHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.emoji}</span>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{entry.mood}</p>
                      <p className="text-xs text-gray-500">{entry.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-6 rounded-full ${
                          i < entry.intensity ? 'bg-purple-500' : 'bg-purple-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journal Prompt */}
          <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 shadow-lg">
            <h3 className="font-bold mb-3 text-sm text-gray-800">Reflexão do Dia</h3>
            <p className="text-xs text-gray-600 mb-4">O que você está grato hoje?</p>
            <textarea
              className="w-full bg-white/80 border border-purple-200 rounded-xl px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none shadow-sm"
              rows={4}
              placeholder="Escreva seus pensamentos..."
            />
            <button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-lg">
              Salvar Reflexão
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // GOALS SCREEN
  if (currentScreen === "goals") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Suas Metas
          </h2>
          <p className="text-gray-600 text-sm mb-6">Acompanhe seu progresso e celebre conquistas</p>

          {/* Goals List */}
          <div className="space-y-4 mb-6">
            {goals.map(goal => {
              const percentage = (goal.progress / goal.target) * 100;
              return (
                <div
                  key={goal.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">{goal.title}</h3>
                        <p className="text-xs text-gray-500">
                          {goal.progress} de {goal.target} dias
                        </p>
                      </div>
                    </div>
                    <Award className={`w-6 h-6 ${percentage >= 100 ? 'text-purple-600' : 'text-gray-300'}`} />
                  </div>
                  <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{Math.round(percentage)}% completo</p>
                </div>
              );
            })}
          </div>

          {/* Add New Goal */}
          <button className="w-full bg-white/80 backdrop-blur-sm border border-purple-200 hover:shadow-md rounded-xl p-4 flex items-center justify-center gap-2 transition-all mb-6 shadow-sm">
            <Plus className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-800">Adicionar Nova Meta</span>
          </button>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-800">
              <Star className="w-5 h-5 text-purple-600" />
              Conquistas Recentes
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {["🏆", "⭐", "🎯", "💪"].map((emoji, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-3 text-center border border-purple-200">
                  <span className="text-3xl mb-2 block">{emoji}</span>
                  <p className="text-xs text-gray-600">7 dias</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // COMMUNITY SCREEN
  if (currentScreen === "community") {
    const friends = [
      { name: "Ana", pet: "Mel", mood: "😊", lastActive: "Agora" },
      { name: "Carlos", pet: "Thor", mood: "💪", lastActive: "2h atrás" },
      { name: "Beatriz", pet: "Luna", mood: "😌", lastActive: "5h atrás" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Comunidade
          </h2>
          <p className="text-gray-600 text-sm mb-6">Conecte-se e compartilhe boas vibrações</p>

          {/* Send Good Vibes */}
          <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 mb-6 shadow-lg">
            <h3 className="font-bold mb-4 text-sm text-gray-800">Enviar Boas Vibrações ✨</h3>
            <div className="flex gap-3 flex-wrap">
              {["💜", "🌟", "🎉", "💪", "🙏", "❤️"].map((emoji, index) => (
                <button
                  key={index}
                  className="text-3xl p-3 bg-gradient-to-br from-purple-100 to-pink-100 hover:shadow-md rounded-xl transition-all hover:scale-110 active:scale-95 border border-purple-200"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Friends List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 mb-6 shadow-lg">
            <h3 className="font-bold mb-4 text-sm text-gray-800">Seus Amigos</h3>
            <div className="space-y-3">
              {friends.map((friend, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{friend.name}</p>
                      <p className="text-xs text-gray-500">Pet: {friend.pet}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl">{friend.mood}</span>
                    <p className="text-xs text-gray-500 mt-1">{friend.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Feed */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 shadow-lg">
            <h3 className="font-bold mb-4 text-sm text-gray-800">Feed da Comunidade</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm text-gray-800">Ana</span>
                  <span className="text-xs text-gray-500">completou 7 dias de sequência!</span>
                </div>
                <p className="text-sm text-gray-700">🎉 Estou muito feliz com meu progresso!</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm text-gray-800">Carlos</span>
                  <span className="text-xs text-gray-500">enviou boas vibrações</span>
                </div>
                <p className="text-sm text-gray-700">💪 Vamos juntos nessa jornada!</p>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return null;
}
