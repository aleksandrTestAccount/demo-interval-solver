import e0Grammar from '../config/e0.tmLanguage.json'

function prepareRules(grammar) {
  return grammar.patterns
    .map((pattern) => {
      if (pattern.match) {
        return {
          name: pattern.name,
          regex: new RegExp(pattern.match, 'ym')
        }
      }
      if (pattern.begin && pattern.end) {
        return {
          name: pattern.name,
          beginRegex: new RegExp(pattern.begin, 'ym'),
          endRegex: new RegExp(pattern.end, 's')
        }
      }
      return null
    })
    .filter(Boolean)
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function tokenize(code, compiledRules) {
  const tokens = []
  let index = 0
  const length = code.length

  while (index < length) {
    let matchFound = false

    for (const rule of compiledRules) {
      if (rule.regex) {
        rule.regex.lastIndex = index
        const match = rule.regex.exec(code)
        if (match) {
          tokens.push({ name: rule.name, value: match[0] })
          index += match[0].length
          matchFound = true
          break
        }
      } else if (rule.beginRegex) {
        rule.beginRegex.lastIndex = index
        const startMatch = rule.beginRegex.exec(code)
        if (startMatch) {
          const searchStartIndex = index + startMatch[0].length
          const endMatch = code.slice(searchStartIndex).match(rule.endRegex)
          let blockContent

          if (endMatch) {
            const endIndex = searchStartIndex + endMatch.index + endMatch[0].length
            blockContent = code.slice(index, endIndex)
            index = endIndex
          } else {
            blockContent = code.slice(index)
            index = length
          }

          tokens.push({ name: rule.name, value: blockContent })
          matchFound = true
          break
        }
      }
    }

    if (!matchFound) {
      tokens.push({ name: 'text', value: code[index] })
      index++
    }
  }

  return tokens
}

// Factory function for creating custom or test highlighters
export function createHighlighter(grammar, { classPrefix = 'code-' } = {}) {
  const compiledRules = prepareRules(grammar)

  return function highlight(codeString) {
    if (codeString === null || codeString === undefined || codeString === '') return ''

    const tokens = tokenize(String(codeString), compiledRules)
    let finalHtml = ''

    for (const token of tokens) {
      const escapedValue = escapeHtml(token.value)
      if (token.name === 'text') {
        finalHtml += escapedValue
      } else {
        const className = token.name.replace(/\./g, '-')
        finalHtml += `<span class="${classPrefix}${className}">${escapedValue}</span>`
      }
    }

    return finalHtml
  }
}

// Default instance for E0 language
export const highlightCode = createHighlighter(e0Grammar)
