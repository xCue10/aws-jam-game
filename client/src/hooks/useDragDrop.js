import { useState, useCallback } from 'react';

/**
 * Generic drag-and-drop state hook.
 *
 * For 'bucket' and 'match' types:
 *   placed = { [zoneId]: [itemId, ...] }
 *
 * For 'order' type:
 *   placed = [itemId, ...] (ordered array in the drop list)
 *   unplaced = [itemId, ...] (remaining source items)
 */
export function useDragDrop(type, items) {
  const allIds = items.map((i) => i.id);

  const [dragging, setDragging] = useState(null);     // itemId being dragged
  const [placed, setPlaced] = useState(              // zone → [itemIds]  OR  ordered array
    type === 'order' ? [] : {}
  );
  const [unplaced, setUnplaced] = useState(allIds);  // items not yet placed

  const onDragStart = useCallback((itemId) => {
    setDragging(itemId);
  }, []);

  const onDrop = useCallback((targetZoneId) => {
    if (!dragging) return;
    const itemId = dragging;
    setDragging(null);

    if (type === 'order') {
      // targetZoneId is either 'list' (the ordered list) or an index position
      setUnplaced((prev) => prev.filter((id) => id !== itemId));
      setPlaced((prev) => {
        // If item is already in the ordered list, don't re-add
        if (prev.includes(itemId)) return prev;
        return [...prev, itemId];
      });
    } else {
      // bucket or match — move item into target zone, remove from old zone
      setUnplaced((prev) => prev.filter((id) => id !== itemId));
      setPlaced((prev) => {
        const next = { ...prev };
        // Remove from any existing zone
        for (const zid of Object.keys(next)) {
          next[zid] = next[zid].filter((id) => id !== itemId);
        }
        // For 'match' type — each zone holds exactly one item
        if (type === 'match') {
          // If zone already has an item, send it back to unplaced
          const evicted = next[targetZoneId]?.[0];
          if (evicted) {
            setUnplaced((u) => [...u, evicted]);
          }
          next[targetZoneId] = [itemId];
        } else {
          next[targetZoneId] = [...(next[targetZoneId] || []), itemId];
        }
        return next;
      });
    }
  }, [dragging, type]);

  const onReturnToSource = useCallback((itemId) => {
    // Drag item back to the unplaced pool
    setUnplaced((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
    if (type === 'order') {
      setPlaced((prev) => prev.filter((id) => id !== itemId));
    } else {
      setPlaced((prev) => {
        const next = { ...prev };
        for (const zid of Object.keys(next)) {
          next[zid] = next[zid].filter((id) => id !== itemId);
        }
        return next;
      });
    }
  }, [type]);

  const reset = useCallback(() => {
    setDragging(null);
    setPlaced(type === 'order' ? [] : {});
    setUnplaced(allIds);
  }, [type, allIds]);

  const isComplete =
    type === 'order'
      ? placed.length === allIds.length
      : unplaced.length === 0;

  return { dragging, placed, unplaced, isComplete, onDragStart, onDrop, onReturnToSource, reset };
}
