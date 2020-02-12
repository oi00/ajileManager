// ★STEP2
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'createProductBacklog'
var productstorage = {
  fetch: function () {
    var products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    products.forEach(function (todo, index) {
      todo.id = index
    })
    productstorage.uid = products.length
    return products
  },
  save: function (products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }
}


// ★STEP1
new Vue({
  el: '#app',

  data: {
    // localStorage から 取得した プロダクトバックログ のリスト
    products: [],
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '未着手' },
      { value: 1, label: '完了' }
    ]
  },

  // ★STEP8
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    products: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function (products) {
        productstorage.save(products)
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },

  // ★STEP9
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.products = productstorage.fetch()
  },

  computed: {
    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
    }
  },

  methods: {

    // 追加の処理
    doAdd: function(event, value) {
      // ref で名前を付けておいた要素を参照
      var productName = this.$refs.productName
      var productDetail = this.$refs.productDetail
      // 入力がなければ何もしないで return
      if (!productName.value.length) {
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の products リストへ push
      // 作業状態「state」はデフォルト「未着手=0」で作成
      this.products.push({
        id: productstorage.uid++,
        productName: productName.value,
        productDetail: productDetail.value,
        state: 0
      })
      // フォーム要素を空にする
      productName.value = ''
      productDetail.value = ''
    },

    doChangeState: function (item) {
      item.state = !item.state ? 1 : 0
    },

    doRemove: function (item) {
      var index = this.products.indexOf(item)
      this.products.splice(index, 1)
    },

    function () {
      let sortable = Sortable.create(this.products);
    }
  }

})