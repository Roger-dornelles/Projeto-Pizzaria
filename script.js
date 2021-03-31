let modalQT= 1;
let cart = [];
let modalkey = 0;
// arquivo pizzas.js
pizzaJson.map((item,index) => {

    // preencher campos MODELS
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-key',index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$: ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML=item.description;

    // modal (pizzaWindowArea)
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();

       let key =  e.target.closest('.pizza-item').getAttribute('data-key');
        modalQT=1;
        modalkey = key;
       
       document.querySelector('.pizzaWindowArea').style.opacity = 0;
       document.querySelector('.pizzaWindowArea').style.display = 'flex';
       setTimeout(()=>{
           document.querySelector('.pizzaWindowArea').style.opacity = 1;
        },500);
        
        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        document.querySelectorAll('.pizzaInfo--size').forEach((size,indexSize)=>{
            if(indexSize === 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[indexSize];
        });
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQT;
    })

    // mostrar itens
    document.querySelector('.pizza-area').append(pizzaItem);

});

// fechar modal
const closeModal = ()=>{
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    },500);
};
document.querySelectorAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});

// adicionar quantidades ou diminuir pizzas
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQT > 1){
        modalQT--;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQT;
    }
});

document.querySelector('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQT++;
    document.querySelector('.pizzaInfo--qt').innerHTML=modalQT;
})

//selecionar tamanhos
document.querySelectorAll('.pizzaInfo--size').forEach((size)=>{
    size.addEventListener('click',()=>{
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });

});

//adicionar ao carrinho
document.querySelector('.pizzaInfo--addButton').addEventListener('click',()=>{
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier =  pizzaJson[modalkey].id+'--'+size;
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });

    if(key > -1){
       cart[key].qt += modalQT;
    }else{

        cart.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:modalQT
        });
    }
    updateCart();
    closeModal();
});

// abrir carrinho (mobile)
document.querySelector('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        document.querySelector('aside').style.left = '0';
    }
})
//fechar carrinho (mobile)
document.querySelector('.menu-closer').addEventListener('click',()=>{
    document.querySelector('aside').style.left = '100vw';
})

// preencher carrinho 
const updateCart = ()=>{

    document.querySelector('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';
        let desconto = 0;
        let subTotal = 0;
        let total = 0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id
            })
            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = '(P)';
                    break;
                case 1:
                    pizzaSizeName = '(M)';
                    break;
                case 2:
                    pizzaSizeName = '(G)';
                    break;
            }
                        
            subTotal += pizzaItem.price * cart[i].qt;
          
            cartItem.querySelector('img').src =pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML =`${pizzaItem.name} ${pizzaSizeName}`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i,1)
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            })
            document.querySelector('.cart').append(cartItem);
        }
        desconto = subTotal * 0.1;
        total = subTotal - desconto;
        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subTotal}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    }else{
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }

}

