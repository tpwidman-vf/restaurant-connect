resource "aws_lex_intent" "get_food_order_intent" {
    depends_on = [
      aws_lex_slot_type.pizza_toppings, aws_lex_slot_type.pizza_size
    ]
    name              = "GetFoodOrder"
    sample_utterances = [
        "Can I get a {PizzaSize} pizza",
        "I would like to order a pizza",
        "I would like to order {PizzaCount} {PizzaSize} {PizzaToppings} pizzas",
        "I'd like to order a {PizzaSize} {PizzaToppings} pizza",
    ]

    fulfillment_activity {
        type = "ReturnIntent"
    }

    confirmation_prompt {
        max_attempts = 3

        message {
            content      = "Ok, I have you down for a \u200b{PizzaSize}\u200b \u200b{PizzaToppings}\u200b pizza for {CustomerName}  Is that correct?"
            content_type = "PlainText"
        }
    }

    rejection_statement {
        message {
            content      = "Okay, you're order will not be placed"
            content_type = "PlainText"
        }
    }

    slot {
        name              = "PizzaCount"
        priority          = 3
        slot_constraint   = "Optional"
        slot_type         = "AMAZON.NUMBER"

        value_elicitation_prompt {
            max_attempts = 2

            message {
                content      = "How many pizzas would you like to order?"
                content_type = "PlainText"
            }
        }
    }
    slot {
        name              = "PizzaSize"
        priority          = 1
        slot_constraint   = "Required"
        slot_type         = "PizzaSize"
        slot_type_version = "1"

        value_elicitation_prompt {
            max_attempts = 2

            message {
                content      = "What size pizza would you like?"
                content_type = "PlainText"
            }
        }
    }
    slot {
        name              = "PizzaToppings"
        priority          = 2
        slot_constraint   = "Required"
        slot_type         = "PizzaToppings"
        slot_type_version = "1"

        value_elicitation_prompt {
            max_attempts = 2

            message {
                content      = "What toppings would you like on your pizza?"
                content_type = "PlainText"
            }
        }
    }
    slot {
        name            = "CustomerName"
        priority        = 3
        slot_constraint   = "Required"
        slot_type = "AMAZON.Person"
        value_elicitation_prompt {
            max_attempts = 2

            message {
                content      = "And what is the name for the order?"
                content_type = "PlainText"
            }
        }
        
    }
}

output "intents_arn" {
    value = aws_lex_intent.get_food_order_intent.arn
}