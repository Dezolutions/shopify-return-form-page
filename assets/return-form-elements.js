if(!customElements.get('order-select')) {
  customElements.define(
    'order-select',

    class OrderSelect extends HTMLElement {
      constructor() {
        super();
        
        this.orderSelect = this.querySelector('#orderSelect');
        this.productsTitle = this.querySelector('.products__title');
        this.productsList = this.querySelector('.products__list');
        this.orderSelect.addEventListener('change', this.onChangeOrder.bind(this));
      }

      createProductItemHTML(data) {

        this.productsTitle.innerText = data.title;

        //Remove old data
        this.productsList.innerHTML = '';

        data.items.map((item,index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <label class="product-item">
              <input class="product-item__checkbox" type="checkbox" value="${item.title}" name="contact[product_${index + 1}]"/>
              <span class="product-item__custom-checkbox"></span>
              <div class="product-item__img-block"><img src="${item.img}"/></div>
              <p>${item.title}</p>
            </label>
          `;
          
          this.productsList.appendChild(li);
        }) 
      }

      onChangeOrder(event) {
        const orderUrl = document.getElementById(`${event.target.value}`).dataset.url;
        try {
          fetch(`${orderUrl}?view=return_form`)
          .then(res => res.json())
          .then(data => {
            console.log(this)
            this.productsTitle.innerText = data.title;

        //Remove old data
        this.productsList.innerHTML = '';

        data.items.map((item,index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <label class="product-item">
              <input class="product-item__checkbox" type="checkbox" value="${item.title}" name="contact[product_${index + 1}]"/>
              <span class="product-item__custom-checkbox"></span>
              <div class="product-item__img-block"><img src="${item.img}"/></div>
              <p>${item.title}</p>
            </label>
          `;
          this.productsList.appendChild(li);
        })
          }) 
        } catch (error) {
          console.log(error)
        }
              
      }

    }
  )

}