import re

with open("src/app/admin/page.tsx", "r") as f:
    content = f.read()

# Replace main background wrapper
content = content.replace(
    '<div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-6 transition-colors duration-300">',
    '<div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-gray-100 to-slate-200 dark:from-zinc-900 dark:via-black dark:to-zinc-950 p-4 sm:p-6 transition-colors duration-500 relative">\n      <div className="absolute inset-0 bg-[url(\'https://www.transparenttextures.com/patterns/cubes.png\')] opacity-5 dark:opacity-[0.02] pointer-events-none"></div>'
)

# Replace cards background
content = content.replace(
    'bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md border border-gray-150 dark:border-zinc-800',
    'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 dark:border-zinc-800/80'
)

content = content.replace(
    'bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-150 dark:border-zinc-800',
    'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40 dark:border-zinc-800/80 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300'
)

content = content.replace(
    'bg-white dark:bg-zinc-900 rounded-3xl shadow-md border border-gray-150 dark:border-zinc-800 overflow-hidden',
    'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-zinc-800/80 overflow-hidden'
)

# Other general white/zinc-900 bg
content = content.replace(
    'bg-white dark:bg-zinc-900',
    'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl'
)

content = content.replace(
    'bg-gray-50 dark:bg-zinc-950',
    'bg-slate-50/50 dark:bg-zinc-950/50 backdrop-blur-md'
)

content = content.replace(
    'bg-gray-100 dark:bg-zinc-850',
    'bg-slate-100/50 dark:bg-zinc-800/50'
)

# Buttons
content = content.replace(
    'bg-indigo-600 text-white shadow-sm',
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
)

content = content.replace(
    'text-gray-900 dark:text-white',
    'text-slate-900 dark:text-white'
)

with open("src/app/admin/page.tsx", "w") as f:
    f.write(content)
