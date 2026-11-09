const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function boot(){
 const nodes=new Map();const store=new Map();
 const element=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',innerHTML:'',classList:{toggle(){}},oninput:null,onchange:null,onclick:null});return nodes.get(id)};
 const ctx={document:{getElementById:element},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},Date,console};
 vm.createContext(ctx);vm.runInContext(script,ctx);return {ctx,element,store,run:code=>vm.runInContext(code,ctx)};
}
test('catálogo inicial tiene nueve productos',()=>{const a=boot();assert.equal(a.run('inventory.length'),9);assert.match(a.element('products').innerHTML,/Arroz 1 kg/)});
test('búsqueda parcial filtra arroz y manzanas',()=>{const a=boot();a.element('search').value='arroz';a.element('search').oninput();assert.match(a.element('products').innerHTML,/Arroz 1 kg/);assert.doesNotMatch(a.element('products').innerHTML,/Manzanas 1 kg/);a.element('search').value='manz';a.element('search').oninput();assert.match(a.element('products').innerHTML,/Manzanas 1 kg/)});
test('filtro de categoría muestra solo lácteos',()=>{const a=boot();a.element('category').value='Lácteos';a.element('category').onchange();assert.match(a.element('products').innerHTML,/Leche 1 L/);assert.doesNotMatch(a.element('products').innerHTML,/Arroz 1 kg/)});
test('carrito suma, resta y actualiza totales',()=>{const a=boot();a.run('add(0);add(0);add(2)');assert.equal(a.element('total').textContent,'$5.070');assert.equal(a.element('count').textContent,'(3)');a.run('change(0,-1)');assert.equal(a.element('total').textContent,'$3.180')});
test('checkout bloquea usuario sin sesión',()=>{const a=boot();a.run('add(0)');a.element('checkout').onclick();assert.match(a.element('message').innerHTML,/Primero inicia sesión/)});
test('login rechaza correo inválido y contraseña corta',()=>{const a=boot();a.element('email').value='invalido';a.element('password').value='123';a.element('login').onclick();assert.match(a.element('message').innerHTML,/correo válido/);assert.equal(a.store.get('cr_user'),undefined)});
test('pedido de demostración se registra y vacía carrito',()=>{const a=boot();a.element('email').value='cliente@ejemplo.cl';a.element('password').value='12345678';a.element('login').onclick();a.run('add(0)');a.element('store').value='Ñuñoa';a.element('slot').value='12:00–14:00';a.element('mode').value='Retiro en tienda';a.element('checkout').onclick();const orders=JSON.parse(a.store.get('cr_orders'));assert.equal(orders.length,1);assert.equal(orders[0].total,1890);assert.equal(orders[0].store,'Ñuñoa');assert.equal(a.element('total').textContent,'$0');assert.match(a.element('message').innerHTML,/no se envió realmente/)});
