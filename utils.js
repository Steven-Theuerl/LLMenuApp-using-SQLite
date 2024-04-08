import { useRef, useEffect } from 'react';

export function getSectionListData(data) {

  const categorySelect = new Set()

  data.forEach(( item ) => {
    categorySelect.add(item.category)
  })

  const selectionArray = Array.from(categorySelect)

  let results = []

  for ( var i = 0; i < selectionArray.length; i++ ) {
    const selectionList = data.filter(( item ) => {
        if (item.category === selectionArray[i]) {
            return item;
        }
    })
    results.push({
        title: selectionArray[i],
        data: selectionList,
    });
  }
  return results;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
