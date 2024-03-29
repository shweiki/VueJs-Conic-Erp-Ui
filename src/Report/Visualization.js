import store from '@/store'
import { nArabicWords } from './nArabicWords.js'
import i18n from '@/lang'
import QRCode from 'qrcode'
import checkPermission from '@/utils/permission'
import { TimeConvert as TimeConvertX, MinutesConvert as MinutesConvertX } from '@/utils'

const JsBarcode = require('jsbarcode')
const { createCanvas } = require('canvas')
const days = ['الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت']

export default function Visualization(Data, Html, Type) {
  console.log('Visualization Data : =>', Data)
  if (Type == 'Set') {
    //  Html += nArabicWords(2000)
    return handle(Data, Html)
  }
}
function handle(Data, Html) {
  Object.keys(Data).forEach(key => {
    if (typeof Data[key] === 'function') {
      Data[key] = Data[key]()
    }
    Html = Html.replaceAll('{{' + key + '}}', Data[key] == null ? '' : Data[key])

    if (Data[key] != null && typeof Data[key] === 'object') {
      Object.keys(Data[key]).forEach(keyo => {
        Html = Html.replaceAll('{{' + key + '.' + keyo + '}}', Data[key][keyo] == null ? '' : Data[key][keyo])
      })
    }

    if (Array.isArray(Data[key])) {
      let endTagKey = -1
      let startTagKey = Html.search('<tr id="' + key + '"')
      if (startTagKey == -1) {
        startTagKey = Html.search('<div id="' + key + '"')
        endTagKey = Html.indexOf('</div>', startTagKey)
        if (startTagKey == -1) {
          startTagKey = Html.search('<section id="' + key + '"')
          endTagKey = Html.indexOf('</section>', startTagKey)
        }
      } else {
        startTagKey = Html.search('<tr id="' + key + '"')
        endTagKey = Html.indexOf('</tr>', startTagKey)
      }

      const res = Html.slice(
        startTagKey,
        endTagKey + 5
      )

      let tabelArray = ''
      Data[key].forEach(element => {
        let row = res
        Object.keys(element).forEach(keya => {
          if (Array.isArray(element[keya])) {
            row = handle(element, row)
          }
          // replace All keys to values
          row = row.replaceAll('{{' + key + '.' + keya + '}}', element[keya] == null ? '' : element[keya])
          // find if have Equation {#  /}
          const searchKeyword = '{#'
          const startingIndices = []
          let indexOccurence = row.indexOf(searchKeyword, 0)
          while (indexOccurence >= 0) {
            startingIndices.push(indexOccurence)
            const Equation = row.slice(
              row.search('{#'),
              row.indexOf('/}', row.search('{#')) + 2
            )
            if (Equation != '' && Equation.search('{{') <= -1) {
              let evalV = Equation.replace('{#', '')
              evalV = evalV.replace('/}', '')
              row = row.replace(Equation, eval(evalV))
            }
            indexOccurence = row.indexOf(searchKeyword, indexOccurence + 1)
          }
        })
        tabelArray += row
      })
      Html = Html.replaceAll(
        Html.slice(
          startTagKey,
          endTagKey + 5
        ),
        tabelArray
      )
    }
  })
  const searchKeyword = '{#'
  const startingIndices = []
  let indexOccurence = Html.indexOf(searchKeyword, 0)
  while (indexOccurence >= 0) {
    startingIndices.push(indexOccurence)
    const Equation = Html.slice(
      Html.search('{#'),
      Html.indexOf('/}', Html.search('{#')) + 2
    )
    if (Equation != '' && Equation.search('{{') <= -1) {
      let evalV = Equation.replace('{#', '')
      evalV = evalV.replace('/}', '')
      Html = Html.replace(Equation, eval(evalV))
    }
    indexOccurence = Html.indexOf(searchKeyword, indexOccurence + 1)
  }
  return Html
}
const ConvetNumberToArabicWords = nArabicWords
const formatDate = formatDateX
const TimeConvert = TimeConvertX
const MinutesConvert = MinutesConvertX
const Status = (s, t) => {
  const status = store.getters.Oprations.find((obj) => {
    return obj.TableName == t && obj.Status == s
  })
  if (status) {
    return status.ArabicOprationDescription
  }
  return s
}
const ToFixed = ToFixedX
const tr = (v) => i18n.t(v)
const Days = (v) => days[v]
const Absent = (v) => { return v.toString().toLowerCase() === 'true' ? 'غياب' : 'حضور' }
const Barcode = (v) => {
  const canvas = createCanvas()
  JsBarcode(canvas, v, {
    format: 'CODE128',
    lineColor: '#000000',
    width: 4,
    height: 40,
    displayValue: false
  })
  return '<img src="' + canvas.toDataURL() + '" />'
}
const QRcode = (v, w = 50, h = 50) => {
  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 1,
    margin: 1,
    width: w,
    height: h
  }
  let imgurl = ''
  QRCode.toDataURL(
    v,
    opts
    , (err, url) => {
      if (err) throw err
      imgurl = url
    })
  return '<img src="' + imgurl + '"  width="' + w + '" height="' + h + '" />'
}
const checkpermission = (v) => {
  if (!checkPermission(v)) {
    return 'display: none;'
  }
}
export function ToFixedX(num) {
  return num.toFixed(3)
}

export function formatDateX(date) {
  const d = new Date(date)
  let day = '' + d.getDate()
  let month = '' + (d.getMonth() + 1)
  const year = d.getFullYear()
  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [day, month, year].join('/')
}
