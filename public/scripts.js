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
    setTestConfiguration()
    // kasih event ke radio button kalau ditekan
    $("input[name='answer']").each(() => {
        this.addEventListener("click", onClickRadioButton)
    })
});

// fungsi untuk mengatur konfigurasi awal dari test
const setTestConfiguration = () => {

    let TestConfiguration = {
        questionTotal: 2,
        testDuration: 15,
        numbersDigit: 5,
        test_id: "",
    }

    // menghasilkan kumpulan angka n digits dan memasukan ke dalam variable question_list
    numbersGenerator(TestConfiguration.questionTotal, TestConfiguration.numbersDigit)

    //durasi test
    testDuration = TestConfiguration.testDuration;

    //atur nilai awal dari timer
    timer = testDuration
    renderTimer(timer)
}

const numbersGenerator = (total, digits) => {
    while (question_list.length < total) {
        let number = []
        while (number.length < digits) {
            let digits = String(Math.floor(Math.random() * 10));
            if (!number.includes(digits)) number.push(digits)
        }
        console.log(number)
        question_list.push(number.join(""))
    }
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

const TestFinish = () => {
    clearInterval(interval)
    console.log(score)
    renderNthNumbers(question_list.length)
    $("#message").removeClass("hidden")
    $("#pertanyaan").addClass("hidden")
}

const onClickRadioButton = (e) => {
    let value = e.target.value
    if (value === undefined || value === "") return null

    if (!currentQuestion.includes(value)) {
        score.correct = score.correct + 1
    } else {
        score.wrong = score.wrong + 1
    }

    e.target.checked = false
    storeScore()
    setQuestion()

    // acak pertanyaan yang baru

}
const storeScore = () => {
    localStorage.setItem("score", JSON.stringify(score))
}


const setQuestion = () => {
    // cetak pertanyaan secara random di kotak pertanyaan

    currentQuestion = question_list[nth_question] && question_list[nth_question].shuffle().split("")
    // console.log(currentQuestion)
    $(".question").html(currentQuestion)
}

const setNumbers = () => {
    // mencetak angka dari soal ke html dan menset nilai optionsnya
    $(".numbers").each((i, obj) => {
        let value = question_list[nth_question].split("")
        obj.innerHTML = value[i]
    })
    $(".questionOptions").each((i, obj) => {
        obj.value = question_list[nth_question].split("")[i]
    })
}


const startTimer = () => {
    started = true
    interval = setInterval(() => {
        timer--
        renderTimer(timer)
        if (timer === 0) renderNewNumbers()
    }, 1000)

}
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



const resetTimer = () => {
    timer = testDuration
}

const renderNthNumbers = (n) => {
    $("#nth_question").html(question_list.length - n)
}
// tambah method baru di obj String untuk mengacak karakter dalam string dan kurangin satu karakter

const renderTimer = (time) => {

    let timeHMS = convertHMS(time)
    $("#timer").html(timeHMS)
}

const convertHMS = (value) => {

    var date = new Date(null);
    date.setSeconds(value); // specify value for SECONDS here
    var result = date.toISOString().substr(11, 8);

    return result
}


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