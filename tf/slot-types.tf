resource "aws_lex_slot_type" "pizza_toppings" {
    create_version = true
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
            "pepperoni cheese", "pepperoni", "peps"
        ]
        value    = "Pepperoni and cheese"
    }
    enumeration_value {
        synonyms = [
            "pepperonis", "pepperoni", "peps"
        ]
        value    = "Pepperoni"
    }
    enumeration_value {
        synonyms = [ 
            "plain", "cheese" 
        ]
        value    = "Cheese"
    }
    value_selection_strategy = "TOP_RESOLUTION"
}

resource "aws_lex_slot_type" "pizza_size" {
    create_version = true
    description              = "Pizza sizes"
    name                     = "PizzaSize"
    enumeration_value {
        synonyms = [
            "10 inch",
            "small"
        ]
        value    = "Small"
    }
    enumeration_value {
        synonyms = [
            "12 inch",
            "medium"
        ]
        value    = "Medium"
    }
    enumeration_value {
        synonyms = [
            "14 inch",
            "large"
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
    enumeration_value {
        synonyms = [ 
            "sheet",
            "party pizza"
        ]
        value = "Sheet"
    }
    value_selection_strategy = "TOP_RESOLUTION"

}