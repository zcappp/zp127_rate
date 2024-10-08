import React from "react"

const RATES = [1, 2, 3, 4, 5]

function render(ref) {
    let { props } = ref
    let { dbf, form } = props
    let val
    if (form) {
        ref.form = typeof form == "string" ? ref.excA(form) : form
        if (typeof ref.form == "object") val = ref.form[dbf]
    } else if (ref.getForm) {
        val = ref.getForm(dbf)
    }
    if (!val) val = ref.value || 0
    return RATES.map(v => <span
        className={v <= (ref.rate || val) ? "zp127item zp127rated" : "zp127item"}
        onClick={e => click(e, ref, v)}
        onMouseEnter={() => {if(!props.readonly) { ref.rate = v; ref.render() }}} onMouseLeave={() => {delete ref.rate; ref.render()}} key={v}>
        {SVG[props.style || "星形"] || props.style}
    </span>)
}

function click(e, ref, v) {
    const { props, setForm } = ref
    if (props.readonly) return
    ref.form ? ref.form[props.dbf] = v : ref.setForm(props.dbf, v)
    if (props.change) ref.exc(props.change, { ...ref.ctx, $val: v }, () => ref.exc("render()"))
    ref.render()
}

const css = `
.zp127item {
    position: relative;
    display: inline-block;
    margin-right: 8px;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.1s;
    color: #e8e8e8;
}
.zp127rated {
    color: var(--main-color);
}
.zp127item:hover {
    transform: scale(1.1);
}
`

$plugin({
    id: "zp127",
    props: [{
        prop: "dbf",
        label: "字段名",
        ph: "必填"
    }, {
        prop: "form",
        label: "字段容器",
        ph: "如不填则使用祖先节点的表单容器"
    }, {
        prop: "style",
        type: "select",
        label: "样式",
        items: ["星形", "心形", "A", "好", "赞"]
    }, {
        prop: "readonly",
        type: "text",
        label: "只读表达式",
        ph: "选填，值为真时只读，使用括弧"
    }, {
        prop: "p.val",
        label: "初始值",
        ph: "通常不填，根据字段名自动从表单容器获取"
    }, {
        prop: "change",
        type: "exp",
        label: "onChange表达式",
        ph: "$val"
    }],
    render,
    css
})

const SVG = {
    星形: <svg className="zsvg" viewBox="64 64 896 896"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"/></svg>,
    心形: <svg className="zsvg" viewBox="0 0 1024 1024"><path d="M946.432 520.768L886.4 580.736h0.128L512.064 955.008H512l-0.064 0.128-374.4-374.272-59.968-60.096c-103.424-103.36-103.424-270.912 0-374.272 103.36-103.36 270.976-103.36 374.4 0L512 206.464l60.032-60.032c103.488-103.36 271.04-103.36 374.528 0 103.296 103.36 103.168 270.912-0.128 374.336"/></svg>
}