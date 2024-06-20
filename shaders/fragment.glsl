// Fragment shader
uniform vec4 _kleur;
uniform sampler2D _SampleTexture2D_05d354efae654685ae767d5042747367_Texture_1;
uniform sampler2D _SampleTexture2D_93baeb500eee418682b46ffcf8325bf0_Texture_1;
uniform sampler2D _SampleTexture2D_e6f75624d5b04785b0748ba077a676af_Texture_1;

void main() {
    vec4 color = texture2D(_SampleTexture2D_05d354efae654685ae767d5042747367_Texture_1, vec2(0.5, 0.5));
    gl_FragColor = color * _kleur;
}
