function expressionCalculator(expr) {
    const priorities = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    }
    let numbers = [],
        operators = []

    if (!check(expr, '()')) {
        throw Error('ExpressionError: Brackets must be paired')
    }

    // !!! парсинг строки сделать
    expr = expr.trim().split(' ')
    expr = expr.map(token => {
        return (isNaN(+token)) ? token : +token
    })

    expr.forEach(token => {
        if (typeof token === 'number') { // если число, то кладем его в стек
            numbers.push(Number(token))
        } else { // если оператор или скобка
            if (!operators.length) { // если стек пуст, то кладем в стек
                operators.push(token)
            } else if (priorities[token] > priorities[operators[operators.length - 1]]) { // если вверху стека оператор с меньшим приоритетом, то кладем в стек
                operators.push(token)
            } else { // иначе выполняем предыдущие операции, пока не встретим оператор с большим или равным приоритетом
                do {
                    let operand2 = numbers.pop()
                    let operand1 = numbers.pop()
                    let operator = operators.pop()
                    numbers.push(executeOperation(operand1, operand2, operator))
                } while (priorities[operators[operators.length - 1]] >= priorities[token])
                operators.push(token)
            }
        }
    });

    while (operators.length) { // вычисляем то, что осталось в стеке
        let operand2 = numbers.pop()
        let operand1 = numbers.pop()
        let operator = operators.pop()
        numbers.push(executeOperation(operand1, operand2, operator))
    }

    return numbers.pop()
}

function executeOperation(operand1, operand2, operator) {
    switch (operator) {
        case '+':
            return operand1 + operand2
        case '-':
            return operand1 - operand2
        case '*':
            return operand1 * operand2
        case '/':
            if (operand2 === 0) throw Error('TypeError: Division by zero.')
            return operand1 / operand2
    }
}

function check(str, config) {
    let stack = []

    for (let i = 0; i < str.length; i++) {
        let char = str[i]
        let index = config.indexOf(char) // ищем индекс скобки в конфиге
        if (stack.includes(char) && char === config[index + 1]) { // если открывающая и закрывающая скобки одинаковые
            index += 1;
        }

        // если скобка в кофиге найдена
        if (index >= 0) {
            // если это открывающая скобка
            if (index % 2 === 0) {
                // кладем ее в стек
                stack.push(char)
            } else { // если скобка закрывающая
                if (stack.length === 0) { // если стек пустой - скобки не сбалансированы
                    return false
                }
                let lastBracket = stack.pop()
                if (lastBracket !== config[index - 1]) { // если последня скобка в стеке не соотвествует своей закрывающей - скобки не сбалансированы
                    return false
                }
            }
        }
    }

    return (stack.length === 0) ? true : false
}

module.exports = {
    expressionCalculator
}