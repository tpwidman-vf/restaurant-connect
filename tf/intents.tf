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
            content      = "Ok, I have you down for a {PizzaSize} {PizzaToppings} pizza for {CustomerName}  Is that correct?"
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
        slot_type_version = aws_lex_slot_type.pizza_size.version

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
        slot_type_version = aws_lex_slot_type.pizza_toppings.version

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

resource "aws_lex_intent" "check_order_status_intent" {
    name              = "CheckOrderStatus"
    sample_utterances = [
        "I would like to check my orders status",
        "Where is my food",
    ]

    fulfillment_activity {
        type = "ReturnIntent"
    }

    slot {
        name              = "CustomerName"
        priority          = 1
        slot_constraint   = "Required"
        slot_type         = "AMAZON.Person"

        value_elicitation_prompt {
            max_attempts = 2

            message {
                content      = "What name is on the order?"
                content_type = "PlainText"                
            }
        }
    }
    slot {
        name              = "CustomerPhone"
        priority          = 2
        slot_constraint   = "Optional"
        slot_type         = "AMAZON.PhoneNumber"

        value_elicitation_prompt {
            max_attempts = 2

            message {
                content      = "What phone number is on the order?"
                content_type = "PlainText"
            }
        }
    }
}


resource "aws_lex_intent" "confirm_intent" {
    name              = "ConfirmIntent"
    sample_utterances = [
        "one",
        "you bet",
        "I am",
        "yep",
        "sure am",
        "you got it",
        "that's the one",
        "yeh",
        "that's correct",
        "correct",
        "yeah",
        "yes",
        "ya"
    ]

    fulfillment_activity {
        type = "ReturnIntent"
    }
}

output "confirm_intent_arn" {
    value = aws_lex_intent.confirm_intent.arn
}

resource "aws_lex_intent" "reject_intent" {
    name              = "RejectIntent"
    sample_utterances = [
        "two",
        "I am not",
        "what",
        "huh",
        "what order",
        "I don't think so",
        "negative",
        "nah",
        "nope",
        "no"
    ]

    fulfillment_activity {
        type = "ReturnIntent"
    }
}

output "reject_intent_arn" {
    value = aws_lex_intent.reject_intent.arn
}

resource "aws_lex_intent" "cancel_order_intent" {
    name = "CancelOrderIntent"
    sample_utterances = [ 
        "cancel order",
        "cancel",        
        "cancel this pizza",
        "cancel the order",
        "no pizza order please",
        "take it back",
        "dont bring it",
        "get rid of this pizza",
        "get rid of it",
        "three"
    ]

    fulfillment_activity {
      type = "ReturnIntent"
    }
}


output "cancel_order_intent_arn" {
    value = aws_lex_intent.cancel_order_intent.arn
}

#resource "aws_lex_intent" "customer_service_rep_intent" {
#    name = "CustomerServiceRepIntent"
#    sample_utterances = [ 
#        "this isn't what I ordered",
#        "zero",
#        "agent",
#        "this pizza stinks",
#        "my order is wrong",
#        "customer service",
#        "i need help",
#        "i would like to talk to someone",
#        "i would like to talk to an agent",
#        "help" 
#    ]
#    fulfillment_activity {
#      type = "ReturnIntent"
#    }
#}
