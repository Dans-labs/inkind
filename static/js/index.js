/*eslint-env jquery*/

const SAVE = true
const DEBUG = true
const BLUR = false

const widgets = {
  text: {
    activate() {},
    read(elem) {
      return elem.prop('value')
    },
  },
  markdown: {
    activate() {},
    read(elem) {
      return elem.prop('value')
    },
  },
  bool: {
    activate(table, eid, field, parent, valueEl, targets) {
      targets.each((i, elem) => {
        const el = $(elem)
        const options = el.find('.button, .label')
        el.find('.button').off('click').click(e => {
          options.removeClass('active')
          const me = $(e.currentTarget)
          me.addClass('active')
          edit(table, eid, field, valueEl, parent)
        })
      })
    },
    read(elem) {
      const el = elem.find('.active')
      return el.hasClass('fa-check')
        ? true
        : el.hasClass('fa-times')
        ? false
        : null
    },
  },
  related: {
    activate(table, eid, field, parent, valueEl, targets) {
      const filterKey = `${table}/${eid}/${field}/filter`
      const multiple = valueEl.attr('multiple')
      const extensible = valueEl.attr('extensible')
      targets.each((i, elem) => {
        const el = $(elem)
        const options = el.find('.button.field, .label.field')
        el.find('.button').off('click').click(e => {
          const me = $(e.currentTarget)
          if (multiple) {
            if (me.hasClass('active')) {
              me.removeClass('active')
            }
            else {
              me.addClass('active')
            }
          }
          else {
            options.removeClass('active')
            me.addClass('active')
          }
          edit(table, eid, field, valueEl, parent)
        })
        const filterControl = el.find('input.wfilter')
        const filterOff = el.find('.button.wfilter')
        const filterAdd = el.find('.button.add')
        const prevFilter = localStorage.getItem(filterKey) || ''
        filterControl.val(prevFilter)
        filterTags(options, prevFilter, filterOff, filterAdd, extensible)
        filterControl.off('keyup').on('keyup', () => {
          const curFilter = filterControl.val()
          localStorage.setItem(filterKey, curFilter)
          filterTags(options, curFilter, filterOff, filterAdd, extensible)
        })
        filterOff.off('click').click(() => {
          const newFilter = ''
          filterControl.val(newFilter)
          localStorage.setItem(filterKey, newFilter)
          filterTags(options, newFilter, filterOff, filterAdd, extensible)
        })
        filterAdd.off('click').click(() => {
          const newTag = filterControl.val()
          if (extensible && newTag) {
            edit(table, eid, field, valueEl, parent, newTag)
          }
        })
      })
    },
    read(elem) {
      const el = elem.find('.active')
      return (el && el.attr('eid')) || null
    },
    readMultiple(elem) {
      return $.makeArray(elem.find('.active').map((i, el) => $(el).attr('eid')))
    },
    collapseMultiple: true,
  },
}

const filterTags = (options, pattern, off, add, extensible) => {
  if (pattern) {
    const pat = pattern.toLowerCase()
    let remaining = 0
    options.each((i, elem) => {
      const el = $(elem)
      const lab = el.attr('lab')
      if (lab.indexOf(pat) == -1) {
        el.hide()
      }
      else {
        el.show()
        remaining++
      }
    })
    off.show()
    if (extensible) {
      if (remaining) {
        add.hide()
      }
      else {
        add.show()
      }
    }
    else {
      add.hide()
    }
  }
  else {
    options.show()
    off.hide()
  }
}

const fetch = (url, destElem, data) => {
  if (data === undefined) {
    $.ajax({
      type: 'GET',
      url,
      processData: false,
      contentType: false,
      success: html => {
        destElem.html(html)
        activateActions(destElem)
        openCloseItems(destElem)
      },
    })
  }
  else {
    $.ajax({
      type: 'POST',
      headers: { 'Content-Type': 'application/json' },
      url,
      data,
      processData: false,
      contentType: true,
      success: html => {
        destElem.html(html)
        activateActions(destElem)
        openCloseItems(destElem)
      },
    })
  }
}

const activateFetch = () => {
  $('[fetchurl]').each((i, elem) => {
    const parent = elem.closest('details')
    const el = $(elem)
    $(parent).on('toggle', () => {
      if (parent.open) {
        const url = el.attr('fetchurl')
        fetch(url, el)
      }
      else {
        el.html('...')
      }
    })
  })
}

const openCloseItems = destElem => {
  const targets = destElem ? destElem.find('details[itemkey]') : $('details[itemkey]')
  targets.each((i, elem) => {
    const el = $(elem)
    const itemKey = el.attr('itemkey')
    const forceOpen = el.attr('forceopen')
    const curOpen = el.prop('open')
    const prevOpen = localStorage.getItem(itemKey)
    const mustBeOpen = prevOpen || forceOpen
    if (curOpen) {
      if (!mustBeOpen) {
        el.prop('open', false)
      }
    }
    else if (!curOpen) {
      if (mustBeOpen) {
        el.prop('open', true)
      }
    }
    el.on('toggle', () => {
      if (elem.open) {
        localStorage.setItem(itemKey, 'open')
      }
      else {
        localStorage.setItem(itemKey, '')
      }
    })
  })
}

const Console = console

const makeFieldUrl = (table, eid, field, action) =>
  `/${table}/item/${eid}/${action}/${field}`

const collectEvents = {}

const view = (table, eid, field, valueEl, parent) => {
  const saveValue = save(table, eid, field, valueEl)
  const url = makeFieldUrl(table, eid, field, 'view')
  fetch(url, parent, saveValue)
}

const edit = (table, eid, field, valueEl, parent, newTag) => {
  const saveValue = save(table, eid, field, valueEl, newTag)
  const url = makeFieldUrl(table, eid, field, 'edit')
  fetch(url, parent, saveValue)
}

const getDynValues = (valueEl, newTag) => {
  const origAttValue = valueEl.attr('orig')
  if (origAttValue === undefined) {
    return {}
  }
  const origValue = atob(origAttValue)
  const multiple = valueEl.attr('multiple')
  const extensible = valueEl.attr('extensible')
  const valueCarrier = valueEl.find('.wvalue')
  const wType = valueEl.attr('wtype')
  const { [wType]: { read, readMultiple } } = widgets
  const givenValuePre = multiple
    ? readMultiple
      ? readMultiple(valueCarrier)
      : $.makeArray(valueCarrier.map((i, el) => read($(el))))
        .filter(v => v !== '')
    : read(valueCarrier)
  const givenValue = (extensible && newTag)
    ? multiple
      ? [...givenValuePre, [newTag]]
      : [newTag]
    : givenValuePre
  const newValue = JSON.stringify(givenValue)
  const dirty = origValue != newValue
  return { origValue, givenValue, newValue, dirty }
}

const save = (table, eid, field, valueEl, newTag) => {
  const { origValue, givenValue, newValue, dirty } = getDynValues(valueEl, newTag)
  if (origValue === undefined) {
    return undefined
  }

  if (DEBUG) {
    const wType = valueEl.attr('wtype')
    const dirtyRep = dirty ? 'dirty' : 'clean'
    const actionRep = dirty ? (SAVE ? 'saving' : 'suppress saving') : 'no save'
    Console.log(
      `WIDGET ${wType}: ${dirtyRep} => ${actionRep}`,
      { valueEl, origValue, newValue }
    )
  }
  return (dirty && SAVE) ? JSON.stringify({ save: givenValue }) : undefined
}

const activateActions = destElem => {
  const targets = destElem ? destElem.find('[action]') : $('[action]')
  targets.each((i, elem) => {
    const el = $(elem)
    const action = el.attr('action')
    const table = el.attr('table')
    const eid = el.attr('eid')
    const field = el.attr('field')
    const parent = $(elem.closest('div'))
    const valueEl = parent.find('[orig]')
    const focusEl = parent.find('input,textarea')
    const focusElFirst = $(focusEl.get(0))
    if (focusElFirst) {
      focusElFirst.focus()
      focusElFirst.val(focusElFirst.val())
    }

    if (action == 'edit') {
      parent.removeClass('edit')
    }
    else if (action == 'view') {
      parent.addClass('edit')
    }
    const actionFunc = (action == 'edit') ? edit : view

    focusEl.off('mousedown').mousedown(() => {
      const eventKey = `${table}:${eid}.${field}`
      collectEvents[eventKey] = true
    })
    el.off('mousedown').mousedown(() => {
      const eventKey = `${table}:${eid}.${field}`
      collectEvents[eventKey] = true
    })
    el.off('click').click(() => {
      const eventKey = `${table}:${eid}.${field}`
      actionFunc(table, eid, field, valueEl, parent)
      collectEvents[eventKey] = false
    })
    focusEl.off('keyup').keyup(() => {
      const { dirty } = getDynValues(valueEl)
      if (dirty) {
        valueEl.addClass('dirty')
      }
      else {
        valueEl.removeClass('dirty')
      }
    })
    if (BLUR) {
      focusEl.off('blur').blur(() => {
        const eventKey = `${table}:${eid}.${field}`
        if (collectEvents[eventKey]) {
          collectEvents[eventKey] = false
        }
        else {
          edit(table, eid, field, valueEl, parent)
        }
      })
    }
    const wType = valueEl.attr('wtype')
    const { [wType]: widget } = widgets
    if (widget) {
      const widgetTargets = valueEl.find('.wvalue')
      widget.activate(table, eid, field, parent, valueEl, widgetTargets)
    }
  })
}

/* main
 *
 */

$(() => {
  activateFetch()
  activateActions()
  openCloseItems()
})
