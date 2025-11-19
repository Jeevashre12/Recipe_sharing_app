export default function generateShoppingList(plan, recipesMap) {
  const map = new Map();
  Object.keys(plan).forEach(day => {
    Object.keys(plan[day]).forEach(slot => {
      const recipeId = plan[day][slot];
      if (!recipeId) return;
      const r = recipesMap[recipeId];
      if (!r || !Array.isArray(r.ingredients)) return;
      r.ingredients.forEach(i => {
        // assume ingredient shape { name, quantity, unit }
        const name = (i.name || '').trim().toLowerCase();
        const unit = (i.unit || '').trim();
        const qty = Number(i.quantity) || (i.count ? Number(i.count) : 1);
        const key = `${name}|${unit}`;
        const prev = map.get(key) || { name: i.name, unit, total: 0, key };
        prev.total += qty;
        map.set(key, prev);
      });
    });
  });
  return Array.from(map.values());
}