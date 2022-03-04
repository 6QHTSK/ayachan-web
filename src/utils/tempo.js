// MIT License
//
// Copyright (c) 2019 憂鬱的烏龜
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// https://github.com/bd4sur/Tempo by bd4sur

// 为适应项目相对源码有少许调整
// Some modifies were taken to adjust the project

let vm
// 信号处理相关
// 2019.08.02 使用TS重写
/**
 * 复数类
 */
var Complex = /** @class */ (function () {
  function Complex (rep, imp) {
    this.rep = 0
    this.imp = 0
    this.rep = rep
    this.imp = imp
  }
  Complex.prototype.add = function (c) {
    return new Complex(c.rep + this.rep, c.imp + this.imp)
  }
  Complex.prototype.sub = function (c) {
    return new Complex(this.rep - c.rep, this.imp - c.imp)
  }
  Complex.prototype.scale = function (r) {
    return new Complex(r * this.rep, r * this.imp)
  }
  Complex.prototype.mul = function (c) {
    var newrep = this.rep * c.rep - this.imp * c.imp
    var newimp = this.rep * c.imp + this.imp * c.rep
    return new Complex(newrep, newimp)
  }
  Complex.prototype.copyFrom = function (c) {
    this.rep = c.rep
    this.imp = c.imp
  }
  Complex.prototype.show = function () {
    console.log('Complex:[ ' + this.rep + ' , ' + this.imp + ' ]')
  }
  Complex.prototype.absSqr = function () {
    return (this.rep * this.rep + this.imp * this.imp)
  }
  return Complex
}())

// 将实数序列转换为复数序列
// eslint-disable-next-line no-extend-native
Array.prototype.toComplexList = function () {
  const list = this
  const clist = []
  const normLen = (LOG[list.length] === undefined) ? parseInt(Math.pow(2, parseInt(Math.log2(list.length) + 1))) : list.length
  for (let i = 0; i < normLen; i++) {
    if (list[i] !== undefined) {
      clist.push(new Complex(list[i], 0))
    } else {
      clist.push(new Complex(0, 0))
    }
  }
  return clist
}

// 指数查找表
const POW = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536]
// 对数查找表
const LOG = {
  1: 0,
  2: 1,
  4: 2,
  8: 3,
  16: 4,
  32: 5,
  64: 6,
  128: 7,
  256: 8,
  512: 9,
  1024: 10,
  2048: 11,
  4096: 12,
  8192: 13,
  16384: 14,
  32768: 15,
  65536: 16
}
// FFT 快速傅立叶变换
function BasicFFT (IN, size, isIFFT) {
  // 计算旋转因子
  function calculateTwiddleFactor (fftSize, isIFFT) {
    var W = new Array(fftSize)
    var ReP = 0
    var ImP = 0
    // 只需要用到0~(fftSize-1)的旋转因子
    for (var i = 0; i < (fftSize >> 1); i++) {
      // W[i] = exp(-2*pi*j*(i/N))
      ReP = Math.cos(2.0 * Math.PI * (i / fftSize))
      if (isIFFT) {
        ImP = Math.sin(2.0 * Math.PI * (i / fftSize))
      } else {
        ImP = -Math.sin(2.0 * Math.PI * (i / fftSize))
      }
      W[i] = new Complex(ReP, ImP)
    }
    return W
  }
  // 生成码位倒置序列
  function bitReverse (fftSize) {
    var brevIndex = []
    var temp = 0
    var bitSize = LOG[fftSize]
    for (var i = 0; i < fftSize; i++) {
      temp = i
      brevIndex[i] = 0
      for (var c = 0; c < bitSize; c++) {
        if (((temp >> c) & 1) !== 0) {
          brevIndex[i] += (1 << (bitSize - 1 - c)) // POW[bitSize - 1 - c];
        }
      }
    }
    return brevIndex
  }
  // 两个数组，用来交替存储各级蝶形运算的结果
  var buf = []
  buf[0] = []
  buf[1] = []
  for (var i = 0; i < size; i++) {
    buf[0][i] = new Complex(0, 0)
    buf[1][i] = new Complex(0, 0)
  }
  var M = LOG[size]
  if (!(size in LOG)) {
    vm.flag = false
    vm.$q.notify({ type: 'negative', message: '函数分析错误' })
    // eslint-disable-next-line no-throw-literal
    throw '[FFT] 输入序列长度必须是2的幂'
  }
  // 码位倒置后的输入序列下标
  var indexIn = bitReverse(size)
  // 旋转因子备用
  var W = calculateTwiddleFactor(size, isIFFT)
  var level = 0
  for (level = 0; level < (((M & 1) === 0) ? M : (M + 1)); level++) {
    for (var group = 0; group < POW[M - level - 1]; group++) {
      // eslint-disable-next-line no-redeclare
      for (var i = 0; i < (1 << level); i++) {
        var indexBuf = i + (group << (level + 1))
        var scalingFactor = (1 << (M - level - 1)) // POW[M-level-1];
        if (level === 0) {
          (buf[0])[indexBuf].copyFrom(IN[indexIn[indexBuf]].add(W[i * scalingFactor].mul(IN[indexIn[indexBuf + (1 << level) /* POW[level] */]])));
          (buf[0])[indexBuf + (1 << level) /* POW[level] */].copyFrom(IN[indexIn[indexBuf]].sub(W[i * scalingFactor].mul(IN[indexIn[indexBuf + (1 << level) /* POW[level] */]])))
        } else {
          (buf[level & 1])[indexBuf].copyFrom((buf[(level + 1) & 1])[indexBuf].add(W[i * scalingFactor].mul((buf[(level + 1) & 1])[indexBuf + (1 << level) /* POW[level] */])));
          (buf[level & 1])[indexBuf + (1 << level) /* POW[level] */].copyFrom((buf[(level + 1) & 1])[indexBuf].sub(W[i * scalingFactor].mul((buf[(level + 1) & 1])[indexBuf + (1 << level) /* POW[level] */])))
        }
      }
    }
  }
  var result = null
  if ((M & 1) === 0) {
    result = buf[(level + 1) & 1]
  } else {
    result = buf[level & 1]
  }
  if (isIFFT) {
    return result.map(function (value) { return value.scale(1 / size) })
  } else {
    return result
  }
}
// eslint-disable-next-line no-unused-vars
function FFT (IN, size) {
  return BasicFFT(IN, size, false)
}
// eslint-disable-next-line no-unused-vars
function IFFT (IN, size) {
  return BasicFFT(IN, size, true)
}

// 聚类
function clustering (BPMdistribution, clusterNumber) {
  const bpmIndex = []
  const freqIndex = []
  for (const bpm in BPMdistribution) {
    bpmIndex.push(parseFloat(bpm))
    freqIndex.push(parseInt(BPMdistribution[bpm]))
  }
  function remainCount (arr) {
    return arr.reduce((prev, curr) => { return (curr) ? (prev + 1) : prev }, 0)
  }
  while (remainCount(bpmIndex) > clusterNumber) {
    // 计算最小距离
    const dist = []
    const bpmIndexWithoutUndefined = bpmIndex.filter((e) => { return e })
    for (let i = 0; i < bpmIndexWithoutUndefined.length - 1; i++) {
      dist[i] = bpmIndexWithoutUndefined[i + 1] - bpmIndexWithoutUndefined[i]
    }
    const minDist = dist.reduce((prev, current) => {
      if (current <= prev) return current
      else return prev
    }, Number.MAX_VALUE)

    // 向左看
    // eslint-disable-next-line no-inner-declarations
    function lookRight (fromIndex, arr) {
      for (let i = fromIndex + 1; i < arr.length; i++) {
        if (arr[i]) return { index: i, value: arr[i] }
      }
      return undefined
    }

    // 向右看
    // eslint-disable-next-line no-inner-declarations
    function lookLeft (fromIndex, arr) {
      for (let i = fromIndex - 1; i >= 0; i--) {
        if (arr[i]) return { index: i, value: arr[i] }
      }
      return undefined
    }

    // 以每个样本点为中心，以最小距离为邻域半径，合并邻域内的样本点
    for (let i = 1; i < bpmIndex.length - 1; i++) {
      if (bpmIndex[i] === undefined) continue
      const left = lookLeft(i, bpmIndex)
      const right = lookRight(i, bpmIndex)
      // 优先向右合并，所以先向右看
      if (right && (right.value <= bpmIndex[i] + minDist)) {
        if (freqIndex[right.index] <= freqIndex[i]) {
          freqIndex[i] += freqIndex[right.index]
          bpmIndex[right.index] = undefined
          freqIndex[right.index] = undefined
        } else {
          freqIndex[right.index] += freqIndex[i]
          bpmIndex[i] = undefined
          freqIndex[i] = undefined
        }
      }
      if (left && bpmIndex[i] && (left.value >= bpmIndex[i] - minDist)) {
        if (freqIndex[left.index] <= freqIndex[i]) {
          freqIndex[i] += freqIndex[left.index]
          bpmIndex[left.index] = undefined
          freqIndex[left.index] = undefined
        } else {
          freqIndex[left.index] += freqIndex[i]
          bpmIndex[i] = undefined
          freqIndex[i] = undefined
        }
      }
    }
  }

  // 结果重新组装成BPM分布
  const bpmValue = bpmIndex.filter((e) => { return e })
  const freqValue = freqIndex.filter((e) => { return e })

  const newDistribution = {}
  for (let i = 0; i < bpmValue.length; i++) {
    newDistribution[bpmValue[i]] = freqValue[i]
  }
  return newDistribution
}

// 将原始采样分帧（不重叠不间隔，不加窗），并计算每一帧的能量，得到能量序列
function GetEnergySeries (PCM, frameOffset, frameNumber, frameLength) {
  // eslint-disable-next-line no-unused-vars
  function ToComplexList (list) {
    const clist = []
    // eslint-disable-next-line no-undef
    const normLen = (LOG[list.length] === undefined) ? parseInt(Math.pow(2, parseInt(Math.log2(list.length) + 1))) : list.length
    for (let i = 0; i < normLen; i++) {
      if (list[i] !== undefined) {
        // eslint-disable-next-line no-undef
        clist.push(new Complex(list[i], 0))
      } else {
        // eslint-disable-next-line no-undef
        clist.push(new Complex(0, 0))
      }
    }
    return clist
  }
  function calculateEnergy (arr) {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += (arr[i] * arr[i])
    }
    return sum
  }
  const maxFrameNumber = (PCM.length / frameLength) >> 0
  if (frameOffset >= maxFrameNumber || frameOffset + frameNumber > maxFrameNumber) {
    vm.flag = false
    vm.$q.notify({ type: 'negative', message: '函数分析错误' })
    // eslint-disable-next-line no-throw-literal
    throw '帧超出原始数据范围'
  } else {
    const energySeries = []
    let offset = frameOffset * frameLength
    const finish = (frameOffset + frameNumber) * frameLength
    while (offset < finish) {
      const frame = PCM.slice(offset, offset + frameLength)
      energySeries.push(calculateEnergy(frame))
      offset += frameLength
    }
    return energySeries
  }
}

// 计算bpm
function BPMAnalyseByFT (PCM, SampleRate, FRAME_NUMBER, FRAME_LENGTH, callbackRunning, callbackFinished) {
  const maxBPM = 60 * SampleRate / FRAME_LENGTH / 2

  const BPMs = {}
  callbackRunning(`节拍帧宽度：${FRAME_LENGTH}采样（${(FRAME_LENGTH / SampleRate * 1000).toFixed(2)}ms）`)
  callbackRunning(`窗长度：${FRAME_NUMBER}个节拍帧（${(FRAME_NUMBER * (FRAME_LENGTH / SampleRate)).toFixed(2)}s）`)

  let POSITION = 0.0
  const TIMER = setInterval(() => {
    // for(let POSITION = 0.0; POSITION <= 1.0; POSITION += 0.1) {
    // 取能量序列的一个窗口
    const center = Math.floor((FRAME_NUMBER >> 1) + POSITION * (PCM.length / FRAME_LENGTH - FRAME_NUMBER))
    const startFrom = Math.floor(center - (FRAME_NUMBER >> 1))
    let energySeries
    try {
      energySeries = GetEnergySeries(PCM, startFrom, FRAME_NUMBER, FRAME_LENGTH)
    } catch (e) {
      clearInterval(TIMER)
    }
    // 求能量-时间谱的FFT
    // eslint-disable-next-line no-undef
    let etSpect
    try {
      etSpect = FFT(energySeries.toComplexList(), FRAME_NUMBER)
    } catch (e) {
      clearInterval(TIMER)
    }

    let maxValue = 0
    let maxIndex = 0
    // 从BPM=30的点开始，寻找谱的峰值位置
    for (let index = Math.ceil(etSpect.length * 30 / maxBPM); index < etSpect.length / 2; index++) {
      if (etSpect[index].absSqr() >= maxValue) {
        maxValue = etSpect[index].absSqr()
        maxIndex = index
      }
    }

    // 将BPM标准化到70~210的范围内
    function normalize (bpm) {
      if (bpm >= 70 && bpm <= 210) return bpm
      else if (bpm > 210) return normalize(bpm >> 1)
      else if (bpm <= 0) return 0
      else return normalize(bpm << 1)
    }

    const BPM = Math.round(maxBPM * maxIndex / (etSpect.length / 2 - 1))
    BPMs[POSITION.toFixed(2)] = normalize(BPM)

    const windowStartTime = (startFrom * FRAME_LENGTH / SampleRate).toFixed(2)
    callbackRunning(`BPM @ ${POSITION.toFixed(2)} (from ${windowStartTime}s) = ${normalize(BPM)}`)
    // }
    POSITION += 0.1
    if (POSITION >= 1.0) {
      clearInterval(TIMER)
      callbackFinished(evaluate(BPMs))
    }
  }, 0.5)

  // 根据速度谱，估计总体BPM
  function evaluate (BPMs) {
    // 频数统计
    // eslint-disable-next-line no-new-object
    let BPMdistribution = {}
    for (const pos in BPMs) {
      if (!(BPMs[pos] in BPMdistribution)) {
        BPMdistribution[BPMs[pos]] = 1
      } else {
        BPMdistribution[BPMs[pos]]++
      }
    }
    // 聚类：聚为3类
    BPMdistribution = clustering(BPMdistribution, 3)
    // 选择频数最大的作为计算得到的BPM
    let maxFreq = 0
    let evaluatedBPM = 0
    for (const bpm in BPMdistribution) {
      if (BPMdistribution[bpm] >= maxFreq) {
        maxFreq = BPMdistribution[bpm]
        evaluatedBPM = bpm
      }
    }
    return {
      TempoDistribution: BPMdistribution,
      TempoSpectrum: BPMs,
      BPM: parseFloat(evaluatedBPM)
    }
  }
}


function BPM (PCM, SampleRate, callbackRunning, callbackFinished) {
  const FRAME_NUMBER = 2048 // 帧的数量（44100Hz，帧宽1024点的情况下，1024帧持续时间约23.8s）
  const FRAME_LENGTH = 2048
  BPMAnalyseByFT(PCM, SampleRate, FRAME_NUMBER, FRAME_LENGTH, callbackRunning, callbackFinished)
}

const AudioContext = new window.AudioContext()

function Render (rawAudioData,call_back) {
  AudioContext.decodeAudioData(rawAudioData, (audioBuffer) => {
    // 获取两个声道的原始数据
    const SampleRate = audioBuffer.sampleRate
    const leftChannel = audioBuffer.getChannelData(0)

    const AudioBufferSourceNode = AudioContext.createBufferSource()
    AudioBufferSourceNode.connect(AudioContext.destination)
    AudioBufferSourceNode.buffer = audioBuffer

    BPM(leftChannel, SampleRate,
      (msg) => {},
      call_back
    )
  })
}

export function analysis(music,result_callback){
  let rawAudioData
  const Reader = new FileReader()
  Reader.onloadend = () => {
    rawAudioData = Reader.result
    Render(rawAudioData,result_callback)
  }
  Reader.readAsArrayBuffer(music)
}
