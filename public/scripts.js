let question_list = []
let nth_question = 0
let currentQuestion = ''
let started = false
let testDuration;
let timer;
let interval;
let score = {
    correct: 0,
    wrong: 0
}


$(document).ready(() => {
    // mengatur soal
    preTestConfiguration()

    // kasih event ke radio button kalau ditekan
    $("input[name='answer']").each(() => {
        this.addEventListener("click", onClickRadioButton)
    })
});

// fungsi untuk mengatur konfigurasi awal dari test
const preTestConfiguration = () => {
    // konfigurasi untuk menentukan gmana bentuk tesnya
    let TestConfiguration = {
        questionTotal: 2,
        testDuration: 15,
        numbersDigit: 7,
        test_id: "",
    }

    // menghasilkan kumpulan angka n digits dan memasukan ke dalam variable question_list
    question_list = numbersGenerator(TestConfiguration)

    // merender html container buat angka dan pilihan jawaban
    setNumberContainerAndChoices(TestConfiguration)

    //durasi test
    testDuration = TestConfiguration.testDuration;

    //atur nilai awal dari timer
    timer = testDuration
    renderTimer(timer)
}


const setNumberContainerAndChoices = ({ numbersDigit }) => {
    for (let i = 0; i < numbersDigit; i++) {
        renderNumberContainers((i + 10).toString(36))
        renderChoicesContainer((i + 10).toString(36))
    }
}

const renderChoicesContainer = (choices) => {
    let choicesContainer = `
        <div class="flex flex-col text-center font-semibold">
            <input class="questionChoices hover:cursor-pointer" type="radio" id="answer" name="answer"
                value="">
            <p>${choices}</p>
        </div>
    `
    $("#choices").append($(choicesContainer))
}


const renderNumberContainers = (choices) => {
    let numberContainer = `
        <div class="numbers-container">
            <p class="numbers ">0</p>
            <p>${choices}</p>
        </div>
    `
    $("#soal").append($(numberContainer))
}

const numbersGenerator = ({ questionTotal, numbersDigit }) => {
    let questions = []
    while (questions.length < questionTotal) {
        let number = []
        while (number.length < numbersDigit) {
            let numbersDigit = String(Math.floor(Math.random() * 10));
            if (!number.includes(numbersDigit)) number.push(numbersDigit)
        }
        console.log(number)
        questions.push(number.join(""))
    }

    return questions
}




// fungsi untuk memulai test
const startTest = () => {
    setNumbers()
    setQuestion()
    renderNthNumbers(nth_question)
    if (!started) {
        startTimer()
    }

    $("#pertanyaan").removeClass("hidden")
    $("#start-test").addClass("hidden")
}


// fungsi untuk menghentikan test
const TestFinish = () => {
    clearInterval(interval)
    console.log(score)
    renderNthNumbers(question_list.length)
    $("#message").removeClass("hidden")
    $("#pertanyaan").addClass("hidden")
}

const uploadResult = () => { }

// fungsi untuk memberikan event listener ke radio button
const onClickRadioButton = (e) => {
    let value = e.target.value
    if (value === undefined || value === "") return null

    if (!currentQuestion.includes(value)) {
        score.correct = score.correct + 1
    } else {
        score.wrong = score.wrong + 1
    }

    e.target.checked = false
    storeScore(score)
    setQuestion()

    // acak pertanyaan yang baru
}

// fungsi untuk menyimpan data ke dalam browser localstorage
const storeScore = (data) => {
    localStorage.setItem("score", JSON.stringify(data))
}

// fungsi untuk mengacak angka untuk pertanyaan selanjutnya
const setQuestion = () => {
    // cetak pertanyaan secara random di kotak pertanyaan

    currentQuestion = question_list[nth_question] && question_list[nth_question].shuffle().split("")
    // console.log(currentQuestion)
    $(".question").html(currentQuestion)
}


// fungsi untuk mencetak angka dan value options ke html 
const setNumbers = () => {
    // mencetak angka dari soal ke html dan menset nilai optionsnya
    $(".numbers").each((i, obj) => {
        let value = question_list[nth_question].split("")
        obj.innerHTML = value[i]
    })
    $(".questionChoices").each((i, obj) => {
        obj.value = question_list[nth_question].split("")[i]
    })
}

// fungsi untuk memulai timer 
const startTimer = () => {
    started = true
    interval = setInterval(() => {
        timer--
        renderTimer(timer)
        if (timer === 0) renderNewNumbers()
    }, 1000)

}

// fungsi untuk merender angka soal baru kalau timer sudah habis
const renderNewNumbers = () => {
    resetTimer()
    if (!(nth_question >= (question_list.length - 1))) {
        nth_question++
        renderNthNumbers(nth_question)
        setQuestion()
        setNumbers()
    } else {
        TestFinish()

    }
}


// fungsi untuk mereset timer
const resetTimer = () => {
    timer = testDuration
}

// fungsi untuk mencetak tinggal berapa soal lagi yang perlu di selesaikan
const renderNthNumbers = (n) => {
    $("#nth_question").html(question_list.length - n)
}


// fungsi untuk mencetak waktu dari timer ke html
const renderTimer = (time) => {

    let timeHMS = convertHMS(time)
    $("#timer").html(timeHMS)
}


// fungsi untuk mengubah waktu detik ke format jam:menit:detik
const convertHMS = (value) => {

    var date = new Date(null);
    date.setSeconds(value); // specify value for SECONDS here
    var result = date.toISOString().substr(11, 8);

    return result
}


// tambah method baru di obj String untuk mengacak karakter dalam string dan kurangin satu karakter
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    a.splice(Math.floor(Math.random() * n), 1)
    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }

    return a.join("");
}