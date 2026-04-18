export function renderSkeletonCards(count = 12) {
  return `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      ${Array.from({ length: count })
        .map(
          () => `
        <article class="animate-pulse rounded-2xl bg-white p-4 shadow dark:bg-slate-900">
          <div class="mb-4 h-40 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
          <div class="mb-2 h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div class="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700"></div>
        </article>
      `
        )
        .join('')}
    </div>
  `;
}
