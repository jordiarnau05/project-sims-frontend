<template>
  <div class="min-h-screen bg-gray-950 text-white">

    <!-- ═══════════════════════════════════════════════════
         NAV
    ═══════════════════════════════════════════════════ -->
    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <div class="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
            <svg class="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <span class="text-lg font-bold tracking-tight">SIMS</span>
        </div>

        <!-- Nav links -->
        <nav class="hidden items-center gap-6 text-sm font-medium text-gray-400 sm:flex">
          <a href="#features" class="transition hover:text-white">Funcionalitats</a>
          <a href="#how-it-works" class="transition hover:text-white">Com funciona</a>
          <a href="#screenshots" class="transition hover:text-white">Captures</a>
          <a href="#faq" class="transition hover:text-white">FAQ</a>
        </nav>

        <!-- CTA -->
        <div class="flex items-center gap-3">
          <RouterLink to="/login" class="text-sm font-medium text-gray-400 transition hover:text-white">
            Iniciar sessió
          </RouterLink>
          <RouterLink
            to="/register"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Prova-ho gratis
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════
         HERO
    ═══════════════════════════════════════════════════ -->
    <section class="relative flex min-h-screen items-center overflow-hidden pt-16">
      <!-- Background glow -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-700/20 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-violet-700/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="grid items-center gap-16 lg:grid-cols-2">
          <!-- Text -->
          <div>
            <span class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <span class="size-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Sistema Integral de Mobilitat Sostenible
            </span>
            <h1 class="mt-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Gestiona la teva
              <span class="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                flota de vehicles
              </span>
              en temps real
            </h1>
            <p class="mt-6 text-lg leading-relaxed text-gray-400">
              SIMS és la plataforma de carsharing per a empreses i municipis. Reserva, gestiona i controla tots els vehicles del teu tenant des d'un sol lloc.
            </p>
            <div class="mt-10 flex flex-wrap items-center gap-4">
              <RouterLink
                to="/register"
                class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 hover:scale-105"
              >
                Comença ara — és gratis
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </RouterLink>
              <a
                href="#screenshots"
                class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Veure demo
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </a>
            </div>

            <!-- Stats -->
            <div class="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
              <div>
                <p class="text-3xl font-extrabold text-white">100%</p>
                <p class="mt-1 text-sm text-gray-500">Temps real</p>
              </div>
              <div>
                <p class="text-3xl font-extrabold text-white">Multi</p>
                <p class="mt-1 text-sm text-gray-500">Tenant</p>
              </div>
              <div>
                <p class="text-3xl font-extrabold text-white">24/7</p>
                <p class="mt-1 text-sm text-gray-500">Disponible</p>
              </div>
            </div>
          </div>

          <!-- Hero image placeholder -->
          <div class="relative">
            <div class="overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/50">
              <!-- Screenshot placeholder — MAP -->
              <div class="flex h-12 items-center gap-2 border-b border-white/10 bg-gray-800/80 px-4">
                <span class="size-3 rounded-full bg-red-500/70"></span>
                <span class="size-3 rounded-full bg-yellow-500/70"></span>
                <span class="size-3 rounded-full bg-green-500/70"></span>
                <span class="ml-3 text-xs text-gray-500">localhost:5173/vehicles-map</span>
              </div>
              <div class="flex h-80 items-center justify-center bg-gray-800/40">
                <!-- SUBSTITUEIX PER: <img src="/screenshots/map.png" alt="Mapa de vehicles" class="w-full h-full object-cover" /> -->
                <div class="text-center">
                  <svg class="mx-auto size-16 text-indigo-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                  <p class="mt-3 text-sm font-medium text-gray-600">Captura de pantalla del mapa</p>
                  <p class="text-xs text-gray-700">[ Substituir per screenshot ]</p>
                </div>
              </div>
            </div>
            <!-- Floating badge -->
            <div class="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-gray-900 px-4 py-3 shadow-xl">
              <span class="flex size-9 items-center justify-center rounded-xl bg-green-500/20">
                <svg class="size-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </span>
              <div>
                <p class="text-xs font-semibold text-white">Reserva confirmada</p>
                <p class="text-xs text-gray-500">AMP001 · Toyota Corolla</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         LOGOS / TRUSTED BY (placeholder)
    ═══════════════════════════════════════════════════ -->
    <section class="border-y border-white/5 bg-gray-900/50 py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p class="text-center text-xs font-semibold uppercase tracking-widest text-gray-600">Dissenyat per a</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale">
          <div class="flex items-center gap-2 text-lg font-bold text-gray-400">🏢 Empreses</div>
          <div class="h-4 w-px bg-white/10"></div>
          <div class="flex items-center gap-2 text-lg font-bold text-gray-400">🏛️ Ajuntaments</div>
          <div class="h-4 w-px bg-white/10"></div>
          <div class="flex items-center gap-2 text-lg font-bold text-gray-400">🎓 Universitats</div>
          <div class="h-4 w-px bg-white/10"></div>
          <div class="flex items-center gap-2 text-lg font-bold text-gray-400">🏥 Hospitals</div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FEATURES
    ═══════════════════════════════════════════════════ -->
    <section id="features" class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mx-auto max-w-2xl text-center">
          <span class="text-sm font-semibold uppercase tracking-widest text-indigo-400">Funcionalitats</span>
          <h2 class="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Tot el que necessites en un sol lloc</h2>
          <p class="mt-4 text-gray-400">Des de la reserva fins al control administratiu, SIMS cobreix tot el cicle de vida d'un vehicle compartit.</p>
        </div>

        <!-- Feature grid -->
        <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div class="group rounded-2xl border border-white/10 bg-gray-900 p-6 transition hover:border-indigo-500/50 hover:bg-gray-800/60">
            <div class="flex size-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition">
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            </div>
            <h3 class="mt-4 text-lg font-bold text-white">Mapa en temps real</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-400">Visualitza tots els vehicles de la flota en un mapa interactiu. Verd = disponible, groc = reservat, vermell = en marxa.</p>
          </div>

          <div class="group rounded-2xl border border-white/10 bg-gray-900 p-6 transition hover:border-indigo-500/50 hover:bg-gray-800/60">
            <div class="flex size-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition">
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 class="mt-4 text-lg font-bold text-white">Reserves instantànies</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-400">Reserva un vehicle en menys de 30 segons. Selecciona data, hora i confirma. El preu es calcula automàticament.</p>
          </div>

          <div class="group rounded-2xl border border-white/10 bg-gray-900 p-6 transition hover:border-indigo-500/50 hover:bg-gray-800/60">
            <div class="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition">
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <h3 class="mt-4 text-lg font-bold text-white">Panel d'administració</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-400">Gestiona vehicles, usuaris, rols i tenants. Controla totes les reserves i facturacions des d'un dashboard complet.</p>
          </div>

          <div class="group rounded-2xl border border-white/10 bg-gray-900 p-6 transition hover:border-indigo-500/50 hover:bg-gray-800/60">
            <div class="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            </div>
            <h3 class="mt-4 text-lg font-bold text-white">Sistema de tickets</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-400">Canal de suport integrat. Els usuaris poden obrir incidències i els administradors les gestionen en temps real.</p>
          </div>

          <div class="group rounded-2xl border border-white/10 bg-gray-900 p-6 transition hover:border-indigo-500/50 hover:bg-gray-800/60">
            <div class="flex size-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 transition">
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v12a2 2 0 002 2h5l3 4 3-4h5a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>
            </div>
            <h3 class="mt-4 text-lg font-bold text-white">Assistent IA</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-400">Chatbot intel·ligent integrat que respon preguntes sobre l'aplicació i guia els usuaris en temps real.</p>
          </div>

          <div class="group rounded-2xl border border-white/10 bg-gray-900 p-6 transition hover:border-indigo-500/50 hover:bg-gray-800/60">
            <div class="flex size-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition">
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h3 class="mt-4 text-lg font-bold text-white">Multi-tenant segur</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-400">Cada organització té el seu espai aïllat. Control granular de rols i permisos per a cada tenant.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         HOW IT WORKS
    ═══════════════════════════════════════════════════ -->
    <section id="how-it-works" class="bg-gray-900/60 py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <span class="text-sm font-semibold uppercase tracking-widest text-indigo-400">Com funciona</span>
          <h2 class="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Reserva un vehicle en 3 passos</h2>
          <p class="mt-4 text-gray-400">Sense complicacions. Des del mòbil o l'ordinador, en menys d'un minut.</p>
        </div>

        <div class="relative mt-16">
          <!-- Connector line (desktop) -->
          <div class="absolute left-1/2 top-8 hidden h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent lg:block"></div>

          <div class="grid gap-8 lg:grid-cols-3">

            <div class="relative flex flex-col items-center text-center">
              <div class="relative flex size-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 text-xl font-extrabold text-white">
                1
              </div>
              <h3 class="mt-5 text-xl font-bold text-white">Obre el mapa</h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-400">Accedeix al mapa interactiu i veu tots els vehicles disponibles (en verd) propers a la teva ubicació.</p>
              <!-- Screenshot placeholder -->
              <div class="mt-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-800">
                <div class="flex h-48 items-center justify-center">
                  <!-- SUBSTITUEIX PER: <img src="/screenshots/step1-map.png" alt="Pas 1 - Mapa" class="w-full h-full object-cover" /> -->
                  <div class="text-center">
                    <svg class="mx-auto size-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                    <p class="mt-2 text-xs text-gray-600">[ Screenshot mapa ]</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative flex flex-col items-center text-center">
              <div class="flex size-16 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-900/50 text-xl font-extrabold text-white">
                2
              </div>
              <h3 class="mt-5 text-xl font-bold text-white">Selecciona i reserva</h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-400">Clica el vehicle que vulguis, tria l'hora d'inici i fi. Veuràs el preu estimat abans de confirmar.</p>
              <!-- Screenshot placeholder -->
              <div class="mt-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-800">
                <div class="flex h-48 items-center justify-center">
                  <!-- SUBSTITUEIX PER: <img src="/screenshots/step2-booking.png" alt="Pas 2 - Reserva" class="w-full h-full object-cover" /> -->
                  <div class="text-center">
                    <svg class="mx-auto size-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <p class="mt-2 text-xs text-gray-600">[ Screenshot formulari reserva ]</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative flex flex-col items-center text-center">
              <div class="flex size-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-900/50 text-xl font-extrabold text-white">
                3
              </div>
              <h3 class="mt-5 text-xl font-bold text-white">Gestiona les teves reserves</h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-400">Des de la secció Reserves veus l'historial, l'estat actual i pots cancel·lar si cal. Tot en un lloc.</p>
              <!-- Screenshot placeholder -->
              <div class="mt-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-800">
                <div class="flex h-48 items-center justify-center">
                  <!-- SUBSTITUEIX PER: <img src="/screenshots/step3-mybookings.png" alt="Pas 3 - Les meves reserves" class="w-full h-full object-cover" /> -->
                  <div class="text-center">
                    <svg class="mx-auto size-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    <p class="mt-2 text-xs text-gray-600">[ Screenshot llistat reserves ]</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         SCREENSHOTS GALLERY
    ═══════════════════════════════════════════════════ -->
    <section id="screenshots" class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <span class="text-sm font-semibold uppercase tracking-widest text-indigo-400">Captures de pantalla</span>
          <h2 class="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Mira-ho per tu mateix</h2>
          <p class="mt-4 text-gray-400">Una interfície neta, moderna i dissenyada per ser intuïtiva des del primer dia.</p>
        </div>

        <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <!-- Screenshot 1 - Mapa principal -->
          <div class="group col-span-full overflow-hidden rounded-2xl border border-white/10 bg-gray-900 lg:col-span-2">
            <div class="flex h-8 items-center gap-1.5 border-b border-white/10 bg-gray-800 px-3">
              <span class="size-2.5 rounded-full bg-red-500/60"></span>
              <span class="size-2.5 rounded-full bg-yellow-500/60"></span>
              <span class="size-2.5 rounded-full bg-green-500/60"></span>
              <span class="ml-2 text-xs text-gray-600">Mapa de vehicles en temps real</span>
            </div>
            <div class="flex h-72 items-center justify-center bg-gray-800/30">
              <!-- SUBSTITUEIX PER: <img src="/screenshots/map-full.png" alt="Mapa de vehicles" class="w-full h-full object-cover" /> -->
              <div class="text-center">
                <svg class="mx-auto size-14 text-indigo-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                <p class="mt-3 text-sm font-semibold text-gray-600">Mapa de vehicles (captura gran)</p>
                <p class="text-xs text-gray-700">[ /screenshots/map-full.png ]</p>
              </div>
            </div>
          </div>

          <!-- Screenshot 2 - Perfil -->
          <div class="overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
            <div class="flex h-8 items-center gap-1.5 border-b border-white/10 bg-gray-800 px-3">
              <span class="size-2.5 rounded-full bg-red-500/60"></span>
              <span class="size-2.5 rounded-full bg-yellow-500/60"></span>
              <span class="size-2.5 rounded-full bg-green-500/60"></span>
              <span class="ml-2 text-xs text-gray-600">Perfil d'usuari</span>
            </div>
            <div class="flex h-72 items-center justify-center bg-gray-800/30">
              <!-- SUBSTITUEIX PER: <img src="/screenshots/profile.png" alt="Perfil" class="w-full h-full object-cover" /> -->
              <div class="text-center">
                <svg class="mx-auto size-14 text-violet-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <p class="mt-3 text-sm font-semibold text-gray-600">Perfil d'usuari</p>
                <p class="text-xs text-gray-700">[ /screenshots/profile.png ]</p>
              </div>
            </div>
          </div>

          <!-- Screenshot 3 - Reserves -->
          <div class="overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
            <div class="flex h-8 items-center gap-1.5 border-b border-white/10 bg-gray-800 px-3">
              <span class="size-2.5 rounded-full bg-red-500/60"></span>
              <span class="size-2.5 rounded-full bg-yellow-500/60"></span>
              <span class="size-2.5 rounded-full bg-green-500/60"></span>
              <span class="ml-2 text-xs text-gray-600">Les meves reserves</span>
            </div>
            <div class="flex h-64 items-center justify-center bg-gray-800/30">
              <!-- SUBSTITUEIX PER: <img src="/screenshots/bookings.png" alt="Reserves" class="w-full h-full object-cover" /> -->
              <div class="text-center">
                <svg class="mx-auto size-14 text-amber-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p class="mt-3 text-sm font-semibold text-gray-600">Les meves reserves</p>
                <p class="text-xs text-gray-700">[ /screenshots/bookings.png ]</p>
              </div>
            </div>
          </div>

          <!-- Screenshot 4 - Admin dashboard -->
          <div class="overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
            <div class="flex h-8 items-center gap-1.5 border-b border-white/10 bg-gray-800 px-3">
              <span class="size-2.5 rounded-full bg-red-500/60"></span>
              <span class="size-2.5 rounded-full bg-yellow-500/60"></span>
              <span class="size-2.5 rounded-full bg-green-500/60"></span>
              <span class="ml-2 text-xs text-gray-600">Panel d'administració</span>
            </div>
            <div class="flex h-64 items-center justify-center bg-gray-800/30">
              <!-- SUBSTITUEIX PER: <img src="/screenshots/admin.png" alt="Admin" class="w-full h-full object-cover" /> -->
              <div class="text-center">
                <svg class="mx-auto size-14 text-emerald-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <p class="mt-3 text-sm font-semibold text-gray-600">Panel d'administració</p>
                <p class="text-xs text-gray-700">[ /screenshots/admin.png ]</p>
              </div>
            </div>
          </div>

          <!-- Screenshot 5 - Tickets -->
          <div class="col-span-full overflow-hidden rounded-2xl border border-white/10 bg-gray-900 lg:col-span-1">
            <div class="flex h-8 items-center gap-1.5 border-b border-white/10 bg-gray-800 px-3">
              <span class="size-2.5 rounded-full bg-red-500/60"></span>
              <span class="size-2.5 rounded-full bg-yellow-500/60"></span>
              <span class="size-2.5 rounded-full bg-green-500/60"></span>
              <span class="ml-2 text-xs text-gray-600">Sistema de tickets</span>
            </div>
            <div class="flex h-64 items-center justify-center bg-gray-800/30">
              <!-- SUBSTITUEIX PER: <img src="/screenshots/tickets.png" alt="Tickets" class="w-full h-full object-cover" /> -->
              <div class="text-center">
                <svg class="mx-auto size-14 text-sky-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                <p class="mt-3 text-sm font-semibold text-gray-600">Sistema de tickets de suport</p>
                <p class="text-xs text-gray-700">[ /screenshots/tickets.png ]</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FAQ
    ═══════════════════════════════════════════════════ -->
    <section id="faq" class="bg-gray-900/60 py-24">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <span class="text-sm font-semibold uppercase tracking-widest text-indigo-400">FAQ</span>
          <h2 class="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Preguntes freqüents</h2>
        </div>

        <div class="mt-12 space-y-3">
          <details
            v-for="faq in faqs"
            :key="faq.q"
            class="group rounded-2xl border border-white/10 bg-gray-900 px-6 py-4 transition hover:border-white/20"
          >
            <summary class="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-white list-none">
              {{ faq.q }}
              <svg class="size-4 shrink-0 text-gray-500 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-gray-400">{{ faq.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         CTA FINAL
    ═══════════════════════════════════════════════════ -->
    <section class="py-24">
      <div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 shadow-2xl shadow-indigo-900/50">
          <div class="pointer-events-none absolute inset-0 opacity-10"
            style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 60px 60px;">
          </div>
          <h2 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Preparat per gestionar la teva flota?
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-lg text-indigo-200">
            Uneix-te a SIMS i digitalitza la gestió dels teus vehicles compartits avui mateix.
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <RouterLink
              to="/register"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:scale-105"
            >
              Crea el teu compte gratis
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </RouterLink>
            <RouterLink
              to="/login"
              class="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Ja tinc compte
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FOOTER
    ═══════════════════════════════════════════════════ -->
    <footer class="border-t border-white/10 bg-gray-950 py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div class="flex items-center gap-2.5">
            <div class="flex size-7 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <span class="font-bold text-white">SIMS</span>
            <span class="text-gray-600">·</span>
            <span class="text-sm text-gray-500">Sistema Integral de Mobilitat Sostenible</span>
          </div>
          <p class="text-xs text-gray-600">© 2026 SIMS · Grup 1 Sprint 5 · DAW</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
const faqs = [
  {
    q: 'Com puc reservar un vehicle?',
    a: 'Accedeix al mapa des del menú principal, fes clic sobre qualsevol vehicle verd (disponible), tria les hores d\'inici i fi i confirma la reserva. El sistema calcularà el preu automàticament.',
  },
  {
    q: 'Puc cancel·lar una reserva?',
    a: 'Sí, des de la secció "Reserves" pots cancel·lar qualsevol reserva en estat "Pendent". Les reserves actives (vehicle en ús) no es poden cancel·lar directament.',
  },
  {
    q: 'Què significa la icona groga al mapa?',
    a: 'La icona groga indica que el vehicle té una reserva imminent (pendent o confirmada que comença aviat). No es pot reservar fins que estigui lliure.',
  },
  {
    q: 'Com funciona el sistema de preus?',
    a: 'El preu es calcula per minuts d\'ús amb una tarifa màxima per hora. Quan confirmes la reserva veus el preu estimat, i al finalitzar el viatge se\'t cobra l\'import real.',
  },
  {
    q: 'Puc gestionar múltiples organitzacions?',
    a: 'Sí, SIMS és multi-tenant. Cada organització (empresa, ajuntament, etc.) té el seu espai independent amb els seus vehicles, usuaris i configuració pròpia.',
  },
  {
    q: 'Com contacto amb suport?',
    a: 'Des de la secció "Tiquets" pots obrir una incidència i un administrador t\'atendrà. També disposes de l\'assistent IA per a preguntes ràpides.',
  },
]
</script>
