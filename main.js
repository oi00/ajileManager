// ★STEP2
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo4'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}


// ★STEP1
new Vue({
  el: '#app',

  data: {
    // ★STEP5 localStorage から 取得した ToDo のリスト
    todos: [],
    // ★STEP11 抽出しているToDoの状態
    selectState: -1,
    selectPerson: "",
    // ★STEP11＆STEP13 各状態のラベル
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '未着手' },
      { value: 1, label: '実行中' },
      { value: 2, label: 'レビュー中' },
      { value: 3, label: '完了' }
    ],
    showContent: false,
    isNew: true
  },

  computed: {

    computedTodos: function () {
      return this.todos.filter(function (el) {
        return this.selectState < 0 ? true : this.selectState === el.state
      }, this).filter(function (el) {
        return this.selectPerson == "" ? true : el.person.indexOf(this.selectPerson) != -1
      }, this)
    },

    // ★STEP13 ラベルを表示する
    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
      // キーから見つけやすいように、次のように加工したデータを作成
      // {0: '作業中', 1: '完了', -1: 'すべて'}
    },

  },

  // ★STEP8
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function (todos) {
        todoStorage.save(todos)
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },

  // ★STEP9
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.todos = todoStorage.fetch()
  },

  methods: {

    // ★STEP7 ToDo 追加の処理
    doAdd: function(event, value) {
      // ref で名前を付けておいた要素を参照
      var task = this.$refs.task
      var endDate = this.$refs.endDate
      var person = this.$refs.person
      var comment = this.$refs.comment
      // 入力がなければ何もしないで return
      if (!task.value.length) {
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「未着手=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        task: task.value,
        endDate: endDate.value,
        person: person.value,
        comment: comment.value,
        state: 0
      })
      // フォーム要素を空にする
      task.value = ''
      endDate.value = ''
      person.value = ''
      comment.value = ''
    },

    //変更イベント
    doChange: function(){
      var id = this.$refs.id
      var task = this.$refs.task
      var endDate = this.$refs.endDate
      var person = this.$refs.person
      var comment = this.$refs.comment
      var state = this.$refs.state
      
      if (!task.value.length) {
        return
      }
      
      var items = this.todos.filter(x => x.id == id.value)

      if(items.length == 0){
        //既に削除されている
        return
      }
      var item = items.shift()

      item.task = task.value
      item.endDate = endDate.value
      item.person = person.value
      item.comment = comment.value
      item.state = Number(state.value)
    },

    // ★STEP10 削除の処理
    doRemove: function () {
      var id = this.$refs.id
      var items = this.todos.filter(x => x.id == id.value)
      if(items.length == 0){
        //既に削除されている
        return
      }
      var item = items.shift()
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
      this.showContent = false
    },

    openModal: function(item){
        this.showContent = true
        this.isNew = (item == null)
        if(item != null){
          this.$refs.id.value = item.id
          this.$refs.task.value = item.task
          this.$refs.endDate.value = item.endDate
          this.$refs.person.value = item.person
          this.$refs.comment.value = item.comment
          this.$refs.state.value = item.state
        }
    },
    
    closeModal: function(){
        this.showContent = false
    },

    checkLimit: function(item){
      var nowDate = new Date();
      var endDate = Date.parse(item.endDate)
      var term = (endDate - nowDate)/ 86400000;
      if(item.state == 3){
        return "fin"
      }else if(term < -1){
        return "out"
      }else if(term <= 1){
        return "pinch"
      }else{
        return "none"
      }
    }
  }

})