resource "aws_lex_slot_type" "pizza_toppings" {
    create_version = false
    description              = "Toppings for pizza"
    name                     = "PizzaToppings"
    enumeration_value {
        synonyms = [
            "mushrooms",
        ]
        value    = "Mushroom"
    }
    enumeration_value {
        synonyms = [
            "pepperoni cheese",
        ]
        value    = "Pepperoni and cheese"
    }
    enumeration_value {
        synonyms = [
            "pepperonis",
        ]
        value    = "Pepperoni"
    }
    enumeration_value {
        value    = "Cheese"
    }
    value_selection_strategy = "TOP_RESOLUTION"
}

resource "aws_lex_slot_type" "pizza_size" {
    create_version = false
    description              = "Pizza sizes"
    name                     = "PizzaSize"
    enumeration_value {
        synonyms = [
            "10 inch",
        ]
        value    = "Small"
    }
    enumeration_value {
        synonyms = [
            "12 inch",
        ]
        value    = "Medium"
    }
    enumeration_value {
        synonyms = [
            "14 inch",
        ]
        value    = "Large"
    }
    enumeration_value {
        synonyms = [
            "16 inch",
            "Extra large",
        ]
        value    = "Extra-large"
    }
    value_selection_strategy = "TOP_RESOLUTION"

}