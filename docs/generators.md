# E0 Equation Language — Generators

```text
generate { 
    name: factor, 
    n: 247, 
}
```

        

```text
generate { 
    name: dlog, 
    base: 3, 
    needle: 16, 
    mod: 37, 
    period: 18, 
}
```

```text
generate {
    name: knapsack,
    maxWeight: 20,
    maxNumber: 300,
    items: [
        {w: 3, v: 53},
        {w: 7, v: 41},   
        {w: 3, v: 10},
        {w: 4, v: 35},
        {w: 5, v: 71},
        {w: 9, v: 67},
    ],
}
``` 

```text
generate { 
    name: subsetSum, 
    sum: 11, 
    values: [3,6,3,5,4,2], 
}
``` 

```text
generate {
    name: sudoku,
    rows: [
        [5, 3, _,  _, 7, _,  _, _, _,],  
        [6, _, _,  1, 9, 5,  _, _, _,],  
        [_, 9, 8,  _, _, _,  _, 6, _,],  
        [8, _, _,  _, 6, _,  _, _, 3,],  
        [4, _, _,  8, _, 3,  _, _, 1,],  
        [7, _, _,  _, 2, _,  _, _, 6,],  
        [_, 6, _,  _, _, _,  2, 8, _,],  
        [_, _, _,  4, 1, 9,  _, _, 5,],  
        [_, _, _,  _, 8, _,  _, 7, 9,], 
    ],
}
```

```text         
generate {
    name: tsp,
    max: 20,
    edges: {
        v1: {
            v2: 2,
            v3: 6,
        },
        v2: {
            v3: 3,
        }
    }
}
```  