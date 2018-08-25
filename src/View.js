import hh from "hyperscript-helpers";
import { h } from "virtual-dom";

import {
    showFormMsg,
    mealInputMsg,
    caloriesInputMsg,
    saveMealMsg
} from "./Update";

const {
    pre,
    div,
    h1,
    button,
    form,
    label,
    input,
    table,
    thead,
    tbody,
    td,
    tr,
    th
} = hh(h);

function fieldSet(labelText, inputValue, oninput) {
    return div({}, [
        label(
            {
                className: "db mb1",
                htmlFor: `${labelText}-input`
            },
            labelText
        ),
        input(
            {
                className: "pa2 input-reset ba w-100 mb2",
                type: "text",
                id: `${labelText}-input`,
                oninput
            },
            inputValue
        )
    ]);
}

function buttonSet(dispatch) {
    return div([
        button(
            {
                className: "f3 pv2 ph3 bg-blue white bn mr2 dim",
                type: "submit"
            },
            "Save"
        ),
        button(
            {
                className: "f3 pv2 ph3 bn dim bg-light-gray",
                type: "button",
                onclick: () => dispatch(showFormMsg(false))
            },
            "Cancel"
        )
    ]);
}

function formView(dispatch, model) {
    const { description, calories, showForm } = model;

    if (showForm) {
        return form(
            {
                className: "w-100 mv2",
                onsubmit: e => {
                    e.preventDefault();
                    dispatch(saveMealMsg);
                }
            },
            [
                fieldSet("Meal", description, e =>
                    dispatch(mealInputMsg(e.target.value))
                ),
                fieldSet("Calories", calories || "", e =>
                    dispatch(caloriesInputMsg(e.target.value))
                ),
                buttonSet(dispatch)
            ]
        );
    } else {
        return button(
            {
                className: "f3 pv2 ph3 bg-blue white bn",
                onclick: () => dispatch(showFormMsg(true))
            },
            "Add meal"
        );
    }
}

const tableHeader = thead(
    tr([
        cell(th, "pa2 tl", "Meal"),
        cell(th, "pa2 tr", "Calories"),
        cell(th, "", "")
    ])
);

function mealsBody(meals) {
    const rows = meals.map(meal => {
        return mealRow(meal);
    });

    return tbody({ className: "" }, [...rows, totalRow(meals)]);
}

function mealRow(meal) {
    return tr({ className: "stripe-dark" }, [
        cell(td, "pa2", meal.description),
        cell(td, "pa2 tr", meal.calories),
        cell(td, "pa2 tr", "icons")
    ]);
}

function cell(tag, className, value) {
    return tag({ className }, value);
}

function totalRow(meals) {
    const total = meals.map(meal => meal.calories).reduce((total, count) => {
        return total + count;
    }, 0);

    return tr({ className: "b" }, [
        cell(td, "pa2 tr", "total:"),
        cell(td, "pa2 tr", total),
        cell(td, "", "")
    ]);
}

function tableView(dispatch, meals) {
    if (meals.length === 0) {
        return div({ className: "mv2 i black-50" }, "No meals to display.");
    }

    return table({ className: "mv2 w-100 collapse" }, [
        tableHeader,
        mealsBody(meals)
    ]);
}

function view(dispatch, model) {
    return div(
        {
            className: "mw6 center"
        },
        [
            h1({ className: "f2 pv2 bb" }, "Calorie Counter"),
            formView(dispatch, model),
            tableView(dispatch, model.meals),
            pre(JSON.stringify(model, null, 2))
        ]
    );
}

export default view;
