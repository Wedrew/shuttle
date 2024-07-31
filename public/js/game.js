document.addEventListener('DOMContentLoaded', () => {

    const arrow = document.querySelector('.arrow');
    const itemBus = document.querySelector('.item-bus');
    const result = document.querySelector('.result');
    const button = document.getElementById('spin-button');
    const defSlotWidth = document.querySelector('.def-slot').offsetWidth;

    let items = Array.from(document.querySelectorAll('.item')).map(element => element.textContent);
    
    function randomizeItems(itemsArray) {
        for (let i = itemsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = itemsArray[i];
            itemsArray[i] = itemsArray[j];
            itemsArray[j] = temp;
        }
        return itemsArray;
    }

   
    button.addEventListener('click', () => {
        items = randomizeItems(items);

        itemBus.innerHTML = items.map(item => `<div class="item">${item}</div>`).join('');
        const totalWidth = itemBus.scrollWidth;

        const scrollDistance = Math.floor(Math.random() * (totalWidth - defSlotWidth)) + defSlotWidth;

        itemBus.style.transition = 'transform 0.2s ease-out';
        itemBus.style.transform = `translateX(-${scrollDistance}px)`;

        result.textContent = `Result: shuffling...`;
        setTimeout(() => {
            itemBus.style.transition = 'none'; 
            itemBus.style.transform = `translateX(0)`; 
            
            itemBus.style.transition = 'transform 0.5s ease-out'; 
            setTimeout(function () {

                result.textContent = `Result: ${items[6]}`;

            }, 600); 
            

        }, 800); 
    });
});