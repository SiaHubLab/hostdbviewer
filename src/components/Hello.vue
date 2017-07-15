<template>
<div>
  <h3>HostDB Viewer</h3>
  <hr />
  <div class="row">
    <div class="col-md-12 text-center">
      <p>
        <input type='file' accept='text/json' v-on:change='openFile'>
      </p>
    </div>
  </div>

  <div class="row">
    <div class="col-md-6 text-center">
      <p><s>Filtered: Origin confirmed</s></p>
      <p>Default sort: Revision window end desc</p>
    </div>
    <div class="col-md-6 text-center">
      <p class="Unresolved">Unresolved: Indicatees that an unitialized value was used.</p>
      <p class="Rejected">Rejected: Indicates that the obligation never got started, no revenue gained or lost.</p>
      <p class="Succeeded">Succeeded: Indicates that the obligation was completed, revenues were gained.</p>
      <p class="Failed">Failed : Indicates that the obligation failed, revenues and collateral were lost.</p>
    </div>


    <div class="col-md-12">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Unlock hash</th>
              <th>Origin Conf</th>
              <!-- <th>R. Constr</th>-->
              <th>Revision Conf</th>
              <th>Proof Constr</th>
              <th>Proof Conf</th>
              <th>Status</th>

              <th>Locked Collateral</th>
              <th>Risked Collateral</th>
              <th>Contract Cost</th>
              <th>p. download revenue</th>
              <th>p. storage revenue</th>
              <th>p. upload revenue</th>
              <th>T. fees</th>
              <th>rev</th>
              <th>file size</th>
              <th>Next proof</th>
              <th>Payout</th>
            </tr>
            <tr class="result">
              <th>-</th>
              <th>-</th>
              <th>-</th>
              <!-- <th>-</th> -->
              <th>-</th>
              <th>-</th>
              <th>-</th>

              <th>{{ _.sumBy(ordered, (o) => parseInt(o.lockedcollateral)) | currency }} SC</th>
              <th>{{ _.sumBy(ordered, (o) => parseInt(o.riskedcollateral)) | currency }} SC</th>
              <th>{{ _.sumBy(ordered, (o) => parseInt(o.contractcost)) | currency }} SC</th>
              <th>{{ _.sumBy(ordered, (o) => parseInt(o.potentialdownloadrevenue)) | currency }} SC</th>
              <th>{{ _.sumBy(ordered, (o) => parseInt(o.potentialstoragerevenue)) | currency }} SC</th>
              <th>{{ _.sumBy(ordered, (o) => parseInt(o.potentialuploadrevenue)) | currency }} SC</th>
              <th>{{ _.sumBy(ordered, (o) => parseInt(o.transactionfeesadded)) | currency }} SC</th>
              <th>---</th>
              <th>{{ _.sumBy(ordered, (o) => parseInt(o.revisiontransactionset[0].filecontractrevisions[0].newfilesize)) | filesize }}</th>
              <th>---</th>
              <th>{{ _.sumBy(ordered, (o) => parseInt(o.origintransactionset[2].filecontracts[0].payout)) | currency }} SC</th>
            </tr>
          </thead>
          <tr v-for="obligation in ordered">
            <td><a :href="'https://explorer.siahub.info/hash/'+obligation.origintransactionset[2].filecontracts[0].unlockhash" target="_blank">{{obligation.origintransactionset[2].filecontracts[0].unlockhash }}</a></td>
            <td>{{obligation.originconfirmed | boolean }} </td>
            <!-- <td>{{obligation.revisionconstructed | boolean }} </td> -->
            <td>{{obligation.revisionconfirmed | boolean }} </td>
            <td>{{obligation.proofconstructed | boolean }} </td>
            <td>{{obligation.proofconfirmed | boolean }} </td>
            <td :class="status(obligation.obligationstatus)">{{status(obligation.obligationstatus)}}</td>

            <td>{{obligation.lockedcollateral | currency }} SC</td>
            <td>{{obligation.riskedcollateral | currency }} SC</td>
            <td>{{obligation.contractcost | currency }} SC</td>
            <td>{{obligation.potentialdownloadrevenue | currency }} SC</td>
            <td>{{obligation.potentialstoragerevenue | currency }} SC</td>
            <td>{{obligation.potentialuploadrevenue | currency }} SC</td>
            <td>{{obligation.transactionfeesadded | currency }} SC</td>

            <td>{{obligation.revisiontransactionset[0].filecontractrevisions[0].newrevisionnumber }}</td>
            <td>{{obligation.revisiontransactionset[0].filecontractrevisions[0].newfilesize | filesize }}</td>
            <td>{{obligation.revisiontransactionset[0].filecontractrevisions[0].newwindowstart }} - {{obligation.revisiontransactionset[0].filecontractrevisions[0].newwindowend }}</td>
            <td>{{obligation.origintransactionset[2].filecontracts[0].payout | currency}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'hello',
  mounted() {
    this.load()
  },
  computed: {
    _() {
      return _
    },
    console() {
      return console
    },
    ordered() {
      // _.filter(this.obligations, function(o) {
      //   return o.originconfirmed
      // })
      return _.orderBy(this.obligations, (o) => o.revisiontransactionset[0].filecontractrevisions[0].newwindowend, 'desc')
      //   return _.orderBy(this.obligations, 'obligationstatus', 'desc')
    }
  },
  methods: {
    load() {
      window.axios.get('./static/obligations.json').then((response) => {
        this.obligations = response.data.obligations
      })
    },
    openFile(event) {
      var input = event.target

      var reader = new FileReader()
      reader.onload = () => {
        var text = JSON.parse(reader.result)
        this.obligations = text.obligations
      }
      reader.readAsText(input.files[0])
    },
    status(status) {
      var result = 'Unknown'

      switch (status) {
        case 0:
          result = 'Unresolved'
          break

        case 1:
          result = 'Rejected'
          break

        case 2:
          result = 'Succeeded'
          break

        case 3:
          result = 'Failed'
          break
      }

      return result
    }
  },
  filters: {
    currency(value) {
      return (value / 1e24).toFixed(2)
    },
    boolean(value) {
      return (value) ? 'Yes' : 'No'
    },
    filesize(bytes) {
      var si = true
      var thresh = 1000
      if (Math.abs(bytes) < thresh) {
        return bytes + ' B'
      }
      var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
      var u = -1
      do {
        bytes /= thresh
        u++
      } while (Math.abs(bytes) >= thresh && u < units.length - 1)

      var size = (bytes % 1) ? bytes.toFixed(1) : bytes.toFixed(0)
      return size + ' ' + units[u]
    }
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      obligations: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

table {
  width: 100%;
}

.result {
  color: #ff00ff;
}

.Unknown {
  color: #000;
}

.Unresolved {
  color: orange;
}

.Succeeded {
  color: green;
}

.Failed {
  color: red;
}

.Rejected {
  color: #cccccc;
}

table,
th {
  text-align: center;
}
</style>
